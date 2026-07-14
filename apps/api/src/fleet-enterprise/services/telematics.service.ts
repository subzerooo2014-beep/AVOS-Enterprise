import { Injectable } from "@nestjs/common";
@Injectable()
export class TelematicsService {
  private readonly readings: Array<Record<string, unknown>> = [];
  record(input: Record<string, unknown>) {
    const reading = {
      id: `telemetry_${Date.now()}`,
      ...input,
      recordedAt: new Date().toISOString(),
    };
    this.readings.push(reading);
    return reading;
  }
  list() { return [...this.readings]; }
}
