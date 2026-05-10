import random
from enum import Enum
from geopy.distance import geodesic


class VehicleState(Enum):
    STOPPED      = "STOPPED"
    ACCELERATING = "ACCELERATING"
    CRUISING     = "CRUISING"
    BRAKING      = "BRAKING"


class ECUSimulator:
    def __init__(self, vehicle: dict):
        self.id       = vehicle["id"]
        self.name     = vehicle["name"]
        self.waypoints = vehicle["waypoints"]
        self.profile  = vehicle["driving_profile"]

        self.speed    = 0.0
        self.rpm      = 800.0
        self.temp     = float(self.profile["temp_idle"])
        self.map_kpa  = 30.0
        self.lambda_af = 14.7

        self.waypoint_idx  = 0
        self.lat           = self.waypoints[0][0]
        self.lng           = self.waypoints[0][1]

        self.state          = VehicleState.STOPPED
        self._stopped_ticks = 0
        self._stop_duration = random.randint(3, 8)

    def tick(self, dt: float = 1.0):
        self._update_state()
        self._update_physics(dt)
        self._update_gps(dt)

    def _update_state(self):
        target_wp = self.waypoints[(self.waypoint_idx + 1) % len(self.waypoints)]
        dist      = geodesic((self.lat, self.lng), target_wp).meters

        if self.state == VehicleState.STOPPED:
            self._stopped_ticks += 1
            if self._stopped_ticks >= self._stop_duration:
                self.state          = VehicleState.ACCELERATING
                self._stopped_ticks = 0
                self._stop_duration = random.randint(3, 8)

        elif dist < 20:
            self.state = VehicleState.BRAKING

        elif self.speed < self.profile["max_speed"] * 0.7:
            self.state = VehicleState.ACCELERATING

        else:
            self.state = VehicleState.BRAKING if random.random() < 0.05 else VehicleState.CRUISING

    def _update_physics(self, dt: float):
        p = self.profile

        if self.state == VehicleState.STOPPED:
            self.speed     = max(0.0, self.speed - p["brake_rate"] * dt * 2)
            self.rpm       = 800.0 + random.gauss(0, 30)
            self.map_kpa   = 28.0  + random.gauss(0, 2)
            self.lambda_af = 14.7  + random.gauss(0, 0.1)

        elif self.state == VehicleState.ACCELERATING:
            self.speed     = min(p["max_speed"], self.speed + p["accel_rate"] * dt)
            rpm_target     = 1200 + (self.speed / p["max_speed"]) * (p["max_rpm"] - 1200)
            self.rpm       = rpm_target + random.gauss(0, 80)
            self.map_kpa   = 60.0 + (self.speed / p["max_speed"]) * 50 + random.gauss(0, 3)
            self.lambda_af = 13.5 + random.gauss(0, 0.3)

        elif self.state == VehicleState.CRUISING:
            noise          = random.gauss(0, 2)
            self.speed     = max(0.0, min(p["max_speed"], self.speed + noise))
            rpm_base       = 1200 + (self.speed / p["max_speed"]) * (p["max_rpm"] * 0.65 - 1200)
            self.rpm       = rpm_base + random.gauss(0, 60)
            self.map_kpa   = 45.0 + random.gauss(0, 4)
            self.lambda_af = 14.7 + random.gauss(0, 0.2)

        elif self.state == VehicleState.BRAKING:
            self.speed     = max(0.0, self.speed - p["brake_rate"] * dt)
            self.rpm       = max(800.0, self.rpm - 150 * dt) + random.gauss(0, 40)
            self.map_kpa   = max(20.0, self.map_kpa - 8 * dt) + random.gauss(0, 2)
            self.lambda_af = 15.5 + random.gauss(0, 0.4)
            if self.speed < 1.0:
                self.state = VehicleState.STOPPED

        load        = self.speed / max(p["max_speed"], 1)
        temp_target = p["temp_idle"] + load * (p["temp_max"] - p["temp_idle"])
        self.temp  += (temp_target - self.temp) * 0.02 + random.gauss(0, 0.3)
        self.temp   = max(20.0, min(p["temp_max"] + 10, self.temp))
        self.rpm    = max(700.0, min(p["max_rpm"] + 500, self.rpm))

    def _update_gps(self, dt: float):
        if self.speed < 0.5:
            return

        target = self.waypoints[(self.waypoint_idx + 1) % len(self.waypoints)]
        dist   = geodesic((self.lat, self.lng), target).meters
        move_m = (self.speed / 3.6) * dt

        if move_m >= dist:
            self.waypoint_idx = (self.waypoint_idx + 1) % len(self.waypoints)
            self.lat, self.lng = target[0], target[1]
        else:
            ratio    = move_m / dist
            self.lat += (target[0] - self.lat) * ratio
            self.lng += (target[1] - self.lng) * ratio

    def obd_snapshot(self) -> dict:
        return {
            "rpm":          round(self.rpm, 1),
            "speed":        round(self.speed, 1),
            "coolant_temp": round(self.temp, 1),
            "map_pressure": round(self.map_kpa, 1),
            "lambda":       round(self.lambda_af, 3),
        }

    def gps_snapshot(self) -> dict:
        return {"lat": round(self.lat, 6), "lng": round(self.lng, 6)}
