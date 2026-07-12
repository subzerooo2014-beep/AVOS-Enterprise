import { randomUUID } from "node:crypto";
import {
  UltraEEvidence,
  UltraEFinding,
  UltraESeverity,
  UltraEValue,
} from "./contracts";

export enum CertificationLevel {
  BRONZE = "bronze",
  SILVER = "silver",
  GOLD = "gold",
  PLATINUM = "platinum",
}

export interface CertificationCriterion {
  key: string;
  category: string;
  weight: number;
  minimumScore: number;
  mandatory: boolean;
}

export interface CertificationCandidate {
  systemKey: string;
  version: string;
  scores: Record<string, number>;
  evidence: Record<string, UltraEValue>;
}

export interface CertificationResult {
  certificateId: string;
  systemKey: string;
  version: string;
  level: CertificationLevel | null;
  score: number;
  certified: boolean;
  findings: UltraEFinding[];
  issuedAt: string;
}

export class EnterpriseCertificationFramework {
  certify(
    candidate: CertificationCandidate,
    criteria: readonly CertificationCriterion[],
  ): CertificationResult {
    const findings: UltraEFinding[] = [];
    let weightedScore = 0;
    let totalWeight = 0;
    let mandatoryFailure = false;

    for (const criterion of criteria) {
      const score = Math.max(
        0,
        Math.min(100, candidate.scores[criterion.key] ?? 0),
      );

      weightedScore += score * criterion.weight;
      totalWeight += criterion.weight;

      if (score < criterion.minimumScore) {
        if (criterion.mandatory) mandatoryFailure = true;

        findings.push({
          code: "CERTIFICATION_CRITERION_FAILED",
          severity: criterion.mandatory
            ? UltraESeverity.ERROR
            : UltraESeverity.WARNING,
          message: `Criterion ${criterion.key} scored below its minimum.`,
          subject: criterion.key,
          metadata: {
            score,
            minimumScore: criterion.minimumScore,
            category: criterion.category,
          },
        });
      }
    }

    const score =
      totalWeight === 0 ? 100 : Math.round(weightedScore / totalWeight);

    const level =
      mandatoryFailure || score < 60
        ? null
        : score >= 95
          ? CertificationLevel.PLATINUM
          : score >= 85
            ? CertificationLevel.GOLD
            : score >= 72
              ? CertificationLevel.SILVER
              : CertificationLevel.BRONZE;

    return {
      certificateId: randomUUID(),
      systemKey: candidate.systemKey,
      version: candidate.version,
      level,
      score,
      certified: level !== null,
      findings,
      issuedAt: new Date().toISOString(),
    };
  }

  createEvidence(
    result: CertificationResult,
  ): UltraEEvidence {
    return {
      id: randomUUID(),
      systemKey: result.systemKey,
      category: "enterprise-certification",
      action: result.certified
        ? "certification.issued"
        : "certification.rejected",
      message: result.certified
        ? `Certification ${result.level} issued for ${result.systemKey}.`
        : `Certification rejected for ${result.systemKey}.`,
      metadata: {
        certificateId: result.certificateId,
        score: result.score,
        level: result.level,
        version: result.version,
      },
      createdAt: new Date().toISOString(),
    };
  }
}
