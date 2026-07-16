import { Module } from "@nestjs/common";
import { EnterpriseBrainMegaPack6Controller } from "./enterprise-brain-mega-pack-6.controller";
import { EnterpriseBrainMegaPack6Service } from "./enterprise-brain-mega-pack-6.service";
import { BrainTrustAuditService } from "./observability/brain-trust-audit.service";
import { BrainEvidenceVaultService } from "./evidence/brain-evidence-vault.service";
import { BrainDecisionTraceabilityService } from "./traceability/brain-decision-traceability.service";
import { BrainExplainabilityService } from "./explainability/brain-explainability.service";
import { BrainHumanApprovalService } from "./approval/brain-human-approval.service";
import { BrainTrustScoreService } from "./trust/brain-trust-score.service";
import { BrainDiagnosticsService } from "./diagnostics/brain-diagnostics.service";
import { BrainTrustGovernanceService } from "./governance/brain-trust-governance.service";
import { BrainTrustDiagnosticsHealthService } from "./health/brain-trust-diagnostics-health.service";

@Module({
  controllers: [EnterpriseBrainMegaPack6Controller],
  providers: [
    EnterpriseBrainMegaPack6Service,
    BrainTrustAuditService,
    BrainEvidenceVaultService,
    BrainDecisionTraceabilityService,
    BrainExplainabilityService,
    BrainHumanApprovalService,
    BrainTrustScoreService,
    BrainDiagnosticsService,
    BrainTrustGovernanceService,
    BrainTrustDiagnosticsHealthService
  ],
  exports: [
    EnterpriseBrainMegaPack6Service,
    BrainTrustAuditService,
    BrainEvidenceVaultService,
    BrainDecisionTraceabilityService,
    BrainExplainabilityService,
    BrainHumanApprovalService,
    BrainTrustScoreService,
    BrainDiagnosticsService,
    BrainTrustGovernanceService,
    BrainTrustDiagnosticsHealthService
  ]
})
export class EnterpriseBrainMegaPack6Module {}
