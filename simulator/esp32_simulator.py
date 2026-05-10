import json
import random
import time
import threading
from datetime import datetime, timezone

import paho.mqtt.client as mqtt

from ecu_simulator import ECUSimulator

OBD_PID_MAP = {
    "rpm":          {"pid": "0x0C", "name": "engine_rpm", "unit": "rpm"},
    "speed":        {"pid": "0x0D", "name": "speed_kmh",  "unit": "km/h"},
    "coolant_temp": {"pid": "0x05", "name": "temp_c",     "unit": "°C"},
    "map_pressure": {"pid": "0x0B", "name": "map_kpa",    "unit": "kPa"},
    "lambda":       {"pid": "0x24", "name": "lambda",     "unit": "A/F"},
}


class ESP32Simulator:
    def __init__(self, vehicle: dict, broker_host: str = "localhost", broker_port: int = 1883):
        self.vehicle_id  = vehicle["id"]
        self.device_id   = f"esp32-{vehicle['id']}"
        self.ecu         = ECUSimulator(vehicle)
        self.broker_host = broker_host
        self.broker_port = broker_port
        self._running    = False
        self._thread     = None

        self.client = mqtt.Client(client_id=self.device_id, protocol=mqtt.MQTTv311)

    def start(self):
        self.client.connect(self.broker_host, self.broker_port, keepalive=60)
        self.client.loop_start()
        self._running = True
        self._thread  = threading.Thread(target=self._run, daemon=True)
        self._thread.start()

    def stop(self):
        self._running = False
        self.client.loop_stop()
        self.client.disconnect()

    def _run(self):
        while self._running:
            self.ecu.tick(dt=1.0)
            self._publish()
            time.sleep(1.0)

    def _publish(self):
        obd     = self.ecu.obd_snapshot()
        gps_raw = self.ecu.gps_snapshot()
        gps     = None if random.random() < 0.05 else gps_raw

        payload = {
            "device_id":  self.device_id,
            "vehicle_id": self.vehicle_id,
            "timestamp":  datetime.now(timezone.utc).isoformat(),
            "gps":        gps,
            "obd":        obd,
            "status":     self.ecu.state.value,
        }

        topic = f"zerith/vehicles/{self.vehicle_id}/telemetry"
        self.client.publish(topic, json.dumps(payload), qos=0)

    def get_status(self) -> dict:
        obd = self.ecu.obd_snapshot()
        return {
            "id":    self.vehicle_id,
            "state": self.ecu.state.value,
            "speed": obd["speed"],
            "rpm":   obd["rpm"],
            "temp":  obd["coolant_temp"],
            "lat":   round(self.ecu.lat, 6),
            "lng":   round(self.ecu.lng, 6),
        }
