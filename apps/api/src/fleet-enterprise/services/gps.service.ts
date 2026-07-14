import { Injectable } from "@nestjs/common";
@Injectable()
export class GpsService {
  private readonly points: Array<Record<string, unknown>> = [];
  record(input: { fleetVehicleId: string; latitude: number; longitude: number; speed: number; recordedAt?: string }) {
    const point = {
      id: `gps_${Date.now()}`,
      ...input,
      recordedAt: input.recordedAt ?? new Date().toISOString(),
    };
    this.points.push(point);
    return point;
  }
  list() { return [...this.points]; }
}
