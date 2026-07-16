import { Module } from "@nestjs/common";
import { FoundationCompletionPack11Controller } from "./foundation-completion-pack-11.controller";
import { FoundationCompletionPack11Service } from "./foundation-completion-pack-11.service";
import { ArchitectureEvolutionRequestService } from "./requests/architecture-evolution-request.service";
import { ArchitectureEvolutionAnalysisService } from "./analysis/architecture-evolution-analysis.service";
import { ArchitectureEvolutionPlanService } from "./plans/architecture-evolution-plan.service";
import { EvolutionApprovalService } from "./approvals/evolution-approval.service";
import { ArchitectureEvolutionExecutionService } from "./execution/architecture-evolution-execution.service";
import { ArchitectureEvolutionRollbackService } from "./rollback/architecture-evolution-rollback.service";
import { EvolutionHistoryService } from "./history/evolution-history.service";
import { EvolutionAuditService } from "./observability/evolution-audit.service";

@Module({
  controllers: [FoundationCompletionPack11Controller],
  providers: [
    FoundationCompletionPack11Service,
    ArchitectureEvolutionRequestService,
    ArchitectureEvolutionAnalysisService,
    ArchitectureEvolutionPlanService,
    EvolutionApprovalService,
    ArchitectureEvolutionExecutionService,
    ArchitectureEvolutionRollbackService,
    EvolutionHistoryService,
    EvolutionAuditService
  ],
  exports: [
    FoundationCompletionPack11Service,
    ArchitectureEvolutionRequestService,
    ArchitectureEvolutionAnalysisService,
    ArchitectureEvolutionPlanService,
    EvolutionApprovalService,
    ArchitectureEvolutionExecutionService,
    ArchitectureEvolutionRollbackService,
    EvolutionHistoryService,
    EvolutionAuditService
  ]
})
export class FoundationCompletionPack11Module {}
