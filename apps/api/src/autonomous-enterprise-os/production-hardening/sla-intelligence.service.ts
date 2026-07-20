import { Injectable } from "@nestjs/common";
import { RuntimeSignalDto } from "./dto/aeos-production.dto";

@Injectable()
export class SlaIntelligenceService {
  evaluate(signal: RuntimeSignalDto) {
    const targetMs = signal.slaTargetMs ?? 2000;
    const latencyMs = signal.latencyMs ?? 0;
    const compliant = latencyMs <= targetMs && (signal.errorRate ?? 0) <= 0.01;

    return {
      unit: signal.unit,
      compliant,
      targetMs,
      observedLatencyMs: latencyMs,
      observedErrorRate: signal.errorRate ?? 0,
      status: compliant ? "within-sla" : "sla-at-risk",
      evaluatedAt: new Date().toISOString(),
    };
  }
}