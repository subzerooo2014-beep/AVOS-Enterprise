import { Injectable } from "@nestjs/common";
import { ExecutiveFactoryIntelligence } from "./factory-knowledge.contracts";

@Injectable()
export class FactoryEnterpriseCertificationService {
  certify(intelligence: ExecutiveFactoryIntelligence, approvedBy: string) {
    if (!approvedBy?.trim()) {
      throw new Error(
        "Human approval is required for enterprise factory certification.",
      );
    }

    const findings: string[] = [];
    if (intelligence.factoryHealthScore < 90) {
      findings.push("factory-health-score-below-threshold");
    }
    if (intelligence.learningMaturityScore < 80) {
      findings.push("learning-maturity-below-threshold");
    }
    if (intelligence.selfHealingReadinessScore < 80) {
      findings.push("self-healing-readiness-below-threshold");
    }

    return {
      certified: findings.length === 0,
      score: Math.round(
        (
          intelligence.factoryHealthScore +
          intelligence.learningMaturityScore +
          intelligence.selfHealingReadinessScore
        ) / 3,
      ),
      certifiedBy: "factory:enterprise-certification-engine",
      approvedBy: approvedBy.trim(),
      findings,
      humanFinalAuthority: true,
      createdAt: new Date().toISOString(),
    };
  }
}
