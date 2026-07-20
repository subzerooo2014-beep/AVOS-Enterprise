import { Module } from "@nestjs/common";
import { AdaptiveGrowthExecutionCoreModule } from "../execution-core/adaptive-growth-execution-core.module";
import { AdaptiveGrowthApprovalGovernanceCertificationService } from "./adaptive-growth-approval-governance-certification.service";
import { AdaptiveGrowthApprovalGovernanceController } from "./adaptive-growth-approval-governance.controller";
import { AdaptiveGrowthApprovalGovernanceOperationsController } from "./adaptive-growth-approval-governance-operations.controller";
import { AdaptiveGrowthApprovalGovernanceReadinessService } from "./adaptive-growth-approval-governance-readiness.service";
import { AdaptiveGrowthApprovalGovernanceService } from "./adaptive-growth-approval-governance.service";
import { AdaptiveGrowthApprovalGovernanceVerificationService } from "./adaptive-growth-approval-governance-verification.service";
import { AdaptiveGrowthApprovalPolicyService } from "./adaptive-growth-approval-policy.service";
import { AdaptiveGrowthApprovalQueueService } from "./adaptive-growth-approval-queue.service";
import { AdaptiveGrowthApprovalStoreService } from "./adaptive-growth-approval-store.service";
import { AdaptiveGrowthDecisionAuditService } from "./adaptive-growth-decision-audit.service";
import { AdaptiveGrowthDecisionEvidenceService } from "./adaptive-growth-decision-evidence.service";
import { AdaptiveGrowthDecisionExplainabilityService } from "./adaptive-growth-decision-explainability.service";
import { AdaptiveGrowthDecisionSignatureService } from "./adaptive-growth-decision-signature.service";
import { AdaptiveGrowthGovernanceIdService } from "./adaptive-growth-governance-id.service";
import { AdaptiveGrowthHumanDecisionService } from "./adaptive-growth-human-decision.service";
import { AdaptiveGrowthHumanFinalAuthorityService } from "./adaptive-growth-human-final-authority.service";

@Module({
  imports: [
    AdaptiveGrowthExecutionCoreModule,
  ],
  controllers: [
    AdaptiveGrowthApprovalGovernanceController,
    AdaptiveGrowthApprovalGovernanceOperationsController,
  ],
  providers: [
    AdaptiveGrowthGovernanceIdService,
    AdaptiveGrowthApprovalStoreService,
    AdaptiveGrowthApprovalPolicyService,
    AdaptiveGrowthDecisionAuditService,
    AdaptiveGrowthDecisionEvidenceService,
    AdaptiveGrowthDecisionSignatureService,
    AdaptiveGrowthHumanFinalAuthorityService,
    AdaptiveGrowthApprovalQueueService,
    AdaptiveGrowthDecisionExplainabilityService,
    AdaptiveGrowthHumanDecisionService,
    AdaptiveGrowthApprovalGovernanceService,
    AdaptiveGrowthApprovalGovernanceVerificationService,
    AdaptiveGrowthApprovalGovernanceReadinessService,
    AdaptiveGrowthApprovalGovernanceCertificationService,
  ],
  exports: [
    AdaptiveGrowthApprovalGovernanceService,
    AdaptiveGrowthHumanDecisionService,
    AdaptiveGrowthHumanFinalAuthorityService,
  ],
})
export class AdaptiveGrowthApprovalGovernanceModule {}