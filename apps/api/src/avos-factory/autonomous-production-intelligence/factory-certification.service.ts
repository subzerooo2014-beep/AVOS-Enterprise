import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import {
  FactoryCertification,
  FactoryWorkItem,
} from "./factory-intelligence.contracts";

@Injectable()
export class FactoryCertificationService {
  certify(
    item: FactoryWorkItem,
    approvedBy: string,
  ): FactoryCertification {
    const findings: string[] = [];

    if (!item.approvedBy) {
      findings.push("missing-human-approval");
    }
    if (item.qualityScore < 90) {
      findings.push("quality-score-below-enterprise-threshold");
    }
    if (item.status !== "completed") {
      findings.push("production-not-completed");
    }

    return {
      id: randomUUID(),
      workItemId: item.id,
      certified: findings.length === 0,
      certifiedBy: "factory:certification-engine",
      approvedBy,
      score: item.qualityScore,
      findings,
      createdAt: new Date().toISOString(),
    };
  }
}
