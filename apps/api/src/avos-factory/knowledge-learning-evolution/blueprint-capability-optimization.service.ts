import { Injectable } from "@nestjs/common";
import {
  FactoryPattern,
  ProductionMemoryRecord,
} from "./factory-knowledge.contracts";

@Injectable()
export class BlueprintCapabilityOptimizationService {
  optimize(
    targetId: string,
    memory: ProductionMemoryRecord[],
    patterns: FactoryPattern[],
  ) {
    const failures = memory.filter((record) => record.outcome === "failure");
    const averageQuality =
      memory.length === 0
        ? 0
        : Math.round(
            memory.reduce((sum, record) => sum + record.qualityScore, 0) /
              memory.length,
          );

    return {
      targetId,
      recommendations: [
        ...(failures.length > 0
          ? ["Introduce recovery guardrails for recurring failed stages."]
          : ["Preserve current failure-resistant execution sequence."]),
        ...(averageQuality < 95
          ? ["Raise validation and certification thresholds."]
          : ["Promote this execution profile as a reusable blueprint pattern."]),
        ...(patterns.some((pattern) => pattern.category === "bottleneck")
          ? ["Rebalance resource allocation across parallel stages."]
          : ["Current resource distribution is healthy."]),
      ],
      averageQuality,
      failureCount: failures.length,
      patternCount: patterns.length,
      optimizedAt: new Date().toISOString(),
    };
  }
}
