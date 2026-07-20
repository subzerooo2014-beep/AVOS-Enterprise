import { Injectable } from "@nestjs/common";
import { RuntimeSignalDto } from "./dto/aeos-production.dto";

@Injectable()
export class RuntimeProtectionService {
  evaluate(signal: RuntimeSignalDto) {
    const violations: string[] = [];

    if (signal.healthy === false) violations.push("unit-unhealthy");
    if ((signal.errorRate ?? 0) > 0.05) violations.push("error-rate-high");
    if ((signal.latencyMs ?? 0) > (signal.slaTargetMs ?? 2000)) {
      violations.push("sla-latency-breach");
    }
    if ((signal.capacityUsed ?? 0) > 0.9) violations.push("capacity-critical");

    return {
      unit: signal.unit,
      protected: violations.length === 0,
      violations,
      evaluatedAt: new Date().toISOString(),
    };
  }
}