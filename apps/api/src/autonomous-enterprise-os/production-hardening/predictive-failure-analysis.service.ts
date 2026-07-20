import { Injectable } from "@nestjs/common";
import { RuntimeSignalDto } from "./dto/aeos-production.dto";

@Injectable()
export class PredictiveFailureAnalysisService {
  analyze(signals: RuntimeSignalDto[]) {
    const sample = signals.slice(-20);
    const riskPoints = sample.reduce((risk, item) => {
      let value = risk;
      if (item.healthy === false) value += 40;
      if ((item.errorRate ?? 0) > 0.03) value += 20;
      if ((item.capacityUsed ?? 0) > 0.85) value += 20;
      if ((item.latencyMs ?? 0) > (item.slaTargetMs ?? 2000)) value += 20;
      return value;
    }, 0);

    const normalizedRisk = sample.length
      ? Math.min(100, Math.round(riskPoints / sample.length))
      : 0;

    return {
      riskScore: normalizedRisk,
      probabilityBand:
        normalizedRisk >= 70 ? "high" : normalizedRisk >= 35 ? "medium" : "low",
      recommendation:
        normalizedRisk >= 70
          ? "Initiate controlled recovery and capacity rebalancing."
          : normalizedRisk >= 35
            ? "Increase telemetry frequency and prepare recovery resources."
            : "Continue normal monitoring.",
      analyzedAt: new Date().toISOString(),
    };
  }
}