import { Injectable } from "@nestjs/common";
import { RuntimeSignalDto } from "./dto/aeos-production.dto";

@Injectable()
export class EnterpriseTelemetryService {
  private readonly signals: Array<RuntimeSignalDto & { capturedAt: string }> = [];

  capture(signal: RuntimeSignalDto) {
    const captured = { ...signal, capturedAt: new Date().toISOString() };
    this.signals.push(captured);

    if (this.signals.length > 1000) {
      this.signals.splice(0, this.signals.length - 1000);
    }

    return captured;
  }

  recent(limit = 50) {
    return this.signals.slice(-Math.max(1, Math.min(limit, 200))).reverse();
  }

  count() {
    return this.signals.length;
  }
}