import { UltraHFinding, UltraHSeverity } from "./contracts";

export interface PredictiveSignal {
  key: string;
  category: "incident" | "capacity" | "latency" | "security" | "cost";
  current: number;
  previous: number;
  threshold: number;
  horizonHours: number;
}

export interface OperationalForecast {
  key: string;
  category: string;
  predictedValue: number;
  riskScore: number;
  interventionRequired: boolean;
}

export interface PredictiveOperationsResult {
  forecasts: OperationalForecast[];
  findings: UltraHFinding[];
  generatedAt: string;
}

export class PredictiveOperationsEngine {
  forecast(
    signals: readonly PredictiveSignal[],
  ): PredictiveOperationsResult {
    const findings: UltraHFinding[] = [];

    const forecasts = signals.map((signal): OperationalForecast => {
      const velocity = signal.current - signal.previous;
      const predictedValue = Math.max(
        0,
        Math.round(signal.current + velocity * Math.max(1, signal.horizonHours / 6)),
      );
      const riskScore = Math.max(
        0,
        Math.min(100, Math.round((predictedValue / Math.max(1, signal.threshold)) * 100)),
      );
      const interventionRequired = predictedValue >= signal.threshold;

      if (interventionRequired) {
        findings.push({
          code: "PREDICTIVE_OPERATIONAL_THRESHOLD",
          severity:
            riskScore >= 120
              ? UltraHSeverity.ERROR
              : UltraHSeverity.WARNING,
          message: `Forecast ${signal.key} is expected to exceed its threshold.`,
          subject: signal.key,
          metadata: {
            predictedValue,
            threshold: signal.threshold,
            horizonHours: signal.horizonHours,
          },
        });
      }

      return {
        key: signal.key,
        category: signal.category,
        predictedValue,
        riskScore,
        interventionRequired,
      };
    });

    return {
      forecasts,
      findings,
      generatedAt: new Date().toISOString(),
    };
  }
}
