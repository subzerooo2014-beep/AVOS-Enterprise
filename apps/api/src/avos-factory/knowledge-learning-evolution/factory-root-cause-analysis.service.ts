import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import {
  ProductionMemoryRecord,
  RootCauseAnalysis,
} from "./factory-knowledge.contracts";

@Injectable()
export class FactoryRootCauseAnalysisService {
  analyze(
    workItemId: string,
    history: ProductionMemoryRecord[],
  ): RootCauseAnalysis {
    const failed = history.filter((record) => record.outcome === "failure");
    const highResource = history.filter((record) => record.resourceUnits > 70);
    const slow = history.filter((record) => record.durationMs > 30000);

    const factors: string[] = [];
    if (failed.length > 0) factors.push("historical-stage-failure");
    if (highResource.length > 0) factors.push("resource-pressure");
    if (slow.length > 0) factors.push("execution-latency");
    if (factors.length === 0) factors.push("no-material-failure-pattern");

    return {
      id: randomUUID(),
      workItemId,
      rootCause:
        failed.length > 0
          ? "Execution instability detected in one or more production stages."
          : "No confirmed root cause; preventive analysis only.",
      contributingFactors: factors,
      evidence: history.map(
        (record) =>
          `${record.stage}:${record.outcome}:${record.qualityScore}`,
      ),
      confidence: failed.length > 0 ? 88 : 65,
      recommendedRecovery: [
        "Revalidate dependencies.",
        "Replay the latest successful production memory.",
        "Apply blueprint and capability optimization.",
        "Require human approval before autonomous recovery.",
      ],
      createdAt: new Date().toISOString(),
    };
  }
}
