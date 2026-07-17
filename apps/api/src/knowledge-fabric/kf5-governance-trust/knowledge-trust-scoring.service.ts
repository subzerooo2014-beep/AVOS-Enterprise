import { Injectable } from "@nestjs/common";
import {
  KnowledgeGovernanceDecision,
  KnowledgeTrustAssessmentInput,
} from "./knowledge-governance.types";

@Injectable()
export class KnowledgeTrustScoringService {
  calculate(input: KnowledgeTrustAssessmentInput): {
    trustScore: number;
    decision: KnowledgeGovernanceDecision;
    requiresHumanApproval: boolean;
    reasons: string[];
  } {
    const values = [
      input.sourceReliability,
      input.contentQuality,
      input.provenanceCompleteness,
      input.reviewCoverage,
    ].map((value) => Math.max(0, Math.min(Number(value), 100)));

    const trustScore = Math.round(
      values[0] * 0.3 + values[1] * 0.3 + values[2] * 0.25 + values[3] * 0.15,
    );
    const reasons: string[] = [];
    if (values[0] < 70) reasons.push("Source reliability is below the preferred threshold.");
    if (values[1] < 70) reasons.push("Content quality requires improvement.");
    if (values[2] < 70) reasons.push("Provenance evidence is incomplete.");
    if (values[3] < 60) reasons.push("Human review coverage is limited.");

    const requiresHumanApproval = trustScore < 85 || input.classification === "RESTRICTED";
    const decision: KnowledgeGovernanceDecision =
      trustScore >= 85 && !requiresHumanApproval
        ? "APPROVED"
        : trustScore < 60
          ? "REJECTED"
          : "REVIEW_REQUIRED";

    return { trustScore, decision, requiresHumanApproval, reasons };
  }
}