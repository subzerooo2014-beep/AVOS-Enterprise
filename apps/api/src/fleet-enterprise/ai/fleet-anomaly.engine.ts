import { Injectable } from "@nestjs/common";
@Injectable()
export class FleetAnomalyEngine {
  detect(input: { fuelDelta: number; odometerDelta: number; gpsJumpKm: number }) {
    const anomalies: string[] = [];
    if (input.fuelDelta < -40 && input.odometerDelta < 20) anomalies.push("possible_fuel_loss");
    if (input.gpsJumpKm > 100) anomalies.push("gps_anomaly");
    if (input.odometerDelta < 0) anomalies.push("odometer_anomaly");
    return { anomalies, suspicious: anomalies.length > 0 };
  }
}
