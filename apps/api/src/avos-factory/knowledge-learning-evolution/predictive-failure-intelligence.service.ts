import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import {
  FailurePrediction,
  ProductionMemoryRecord,
} from "./factory-knowledge.contracts";

@Injectable()
export class PredictiveFailureIntelligenceService {
  predict(
    targetId: string,
    history: ProductionMemoryRecord[],
  ): FailurePrediction {
    const failures = history.filter((record) => record.outcome === "failure");
    const probability =
      history.length === 0
        ? 10
        : Math.min(95, Math.round((failures.length / history.length) * 100));

    const severity: FailurePrediction["severity"] =
      probability >= 75
        ? "critical"
        : probability >= 50
          ? "high"
          : probability >= 25
            ? "medium"
            : "low";

    return {
      id: randomUUID(),
      targetId,
      probability,
      severity,
      likelyCause:
        failures.length > 0
          ? "Historical execution failures indicate recurring instability."
          : "No recurring failure evidence detected.",
      preventiveAction:
        failures.length > 0
          ? "Apply blueprint optimization and pre-execution dependency checks."
          : "Continue monitoring and retain current safeguards.",
      createdAt: new Date().toISOString(),
    };
  }
}
