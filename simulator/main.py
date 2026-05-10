import json
import os
import signal
import sys
import time

from esp32_simulator import ESP32Simulator

BROKER_HOST = os.getenv("MQTT_HOST", "localhost")
BROKER_PORT = int(os.getenv("MQTT_PORT", "1883"))

COLORS = {
    "mobi":    "\033[94m",
    "saveiro": "\033[92m",
    "polo":    "\033[93m",
    "strada":  "\033[91m",
    "argo":    "\033[95m",
}
RESET = "\033[0m"
BOLD  = "\033[1m"
CLEAR = "\033[2J\033[H"


def load_vehicles(path: str = "vehicles.json") -> list:
    with open(path) as f:
        return json.load(f)


def print_table(simulators: list):
    print(CLEAR, end="")
    print(f"{BOLD}{'═' * 64}{RESET}")
    print(f"{BOLD}  ZERITH — ESP32 Fleet Simulator{RESET}")
    print(f"{BOLD}{'═' * 64}{RESET}")
    print(f"  {'Vehicle':<12} {'State':<14} {'Speed':>8} {'RPM':>7} {'Temp':>7}  Lat / Lng")
    print(f"  {'─' * 60}")

    for sim in simulators:
        s = sim.get_status()
        c = COLORS.get(s["id"], "")
        print(
            f"  {c}{s['id']:<12}{RESET}"
            f" {s['state']:<14}"
            f" {s['speed']:>6.1f} km/h"
            f" {s['rpm']:>6.0f}"
            f" {s['temp']:>5.1f}°C"
            f"  ({s['lat']:.4f}, {s['lng']:.4f})"
        )

    print(f"\n  Broker: {BROKER_HOST}:{BROKER_PORT}  |  Ctrl+C to stop")


def main():
    vehicles   = load_vehicles()
    simulators = [
        ESP32Simulator(v, broker_host=BROKER_HOST, broker_port=BROKER_PORT)
        for v in vehicles
    ]

    print(f"Connecting to MQTT broker {BROKER_HOST}:{BROKER_PORT}...")
    for sim in simulators:
        sim.start()
    print(f"Started {len(simulators)} vehicle simulators.\n")

    def shutdown(sig, frame):
        print("\nShutting down...")
        for sim in simulators:
            sim.stop()
        sys.exit(0)

    signal.signal(signal.SIGINT, shutdown)
    signal.signal(signal.SIGTERM, shutdown)

    while True:
        print_table(simulators)
        time.sleep(2.0)


if __name__ == "__main__":
    main()
