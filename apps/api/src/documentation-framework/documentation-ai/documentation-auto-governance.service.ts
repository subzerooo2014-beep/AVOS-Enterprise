import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import {
  DocumentationAssetInput,
  DocumentationGovernanceDecision,
  DocumentationQualityReport,
} from "./documentation-ai.types";

@Injectable()
export class DocumentationAutoGovernanceService {
  decide(
    asset: DocumentationAssetInput,
    quality: DocumentationQualityReport,
    forceHumanApproval = true,
  ): DocumentationGovernanceDecision {
    const approved = quality.score >= 75;
    const requiresHumanApproval = forceHumanApproval || !approved;

    return {
      id: `documentation-governance:${randomUUID()}`,
      assetId: asset.id ?? asset.name,
      decision: approved ? "approved" : "requires-improvement",
      status: requiresHumanApproval ? "requires-human-approval" : "final",
      reason: approved
        ? "Documentation quality passed the automated threshold."
        : "Documentation quality is below the required threshold.",
      qualityScore: quality.score,
      requiresHumanApproval,
      humanFinalAuthority: true,
      globalComplianceReadinessGate: true,
      decidedAt: new Date().toISOString(),
    };
  }
}