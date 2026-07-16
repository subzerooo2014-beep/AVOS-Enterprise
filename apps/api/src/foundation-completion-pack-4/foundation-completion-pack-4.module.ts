import { Module } from "@nestjs/common";
import { FoundationCompletionPack4Controller } from "./foundation-completion-pack-4.controller";
import { FoundationCompletionPack4Service } from "./foundation-completion-pack-4.service";
import { ExplainableAiCoreService } from "./explainability/explainable-ai-core.service";
import { DecisionTraceabilityService } from "./traceability/decision-traceability.service";
import { DataProvenanceService } from "./provenance/data-provenance.service";
import { TrustScoreEngineService } from "./trust-score/trust-score-engine.service";
import { AuditByDesignService } from "./audit/audit-by-design.service";
import { HumanApprovalFrameworkService } from "./approval/human-approval-framework.service";

@Module({
  controllers: [FoundationCompletionPack4Controller],
  providers: [
    FoundationCompletionPack4Service,
    ExplainableAiCoreService,
    DecisionTraceabilityService,
    DataProvenanceService,
    TrustScoreEngineService,
    AuditByDesignService,
    HumanApprovalFrameworkService
  ],
  exports: [
    FoundationCompletionPack4Service,
    ExplainableAiCoreService,
    DecisionTraceabilityService,
    DataProvenanceService,
    TrustScoreEngineService,
    AuditByDesignService,
    HumanApprovalFrameworkService
  ]
})
export class FoundationCompletionPack4Module {}
