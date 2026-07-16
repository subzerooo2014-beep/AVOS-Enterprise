import { Module } from "@nestjs/common";
import { FoundationCompletionPack7Controller } from "./foundation-completion-pack-7.controller";
import { FoundationCompletionPack7Service } from "./foundation-completion-pack-7.service";
import { DecisionRegistryService } from "./decisions/decision-registry.service";
import { DecisionTraceGraphService } from "./decisions/decision-trace-graph.service";
import { EvidenceRegistryService } from "./evidence/evidence-registry.service";
import { DataProvenanceGraphService } from "./provenance/data-provenance-graph.service";
import { TrustPolicyRegistryService } from "./policies/trust-policy-registry.service";
import { TrustScoreEngineService } from "./trust/trust-score-engine.service";
import { TrustAuditLedgerService } from "./audit/trust-audit-ledger.service";
import { DecisionReplayService } from "./replay/decision-replay.service";
import { DecisionExplainabilityService } from "./explainability/decision-explainability.service";

@Module({
  controllers: [FoundationCompletionPack7Controller],
  providers: [
    FoundationCompletionPack7Service,
    DecisionRegistryService,
    DecisionTraceGraphService,
    EvidenceRegistryService,
    DataProvenanceGraphService,
    TrustPolicyRegistryService,
    TrustScoreEngineService,
    TrustAuditLedgerService,
    DecisionReplayService,
    DecisionExplainabilityService
  ],
  exports: [
    FoundationCompletionPack7Service,
    DecisionRegistryService,
    DecisionTraceGraphService,
    EvidenceRegistryService,
    DataProvenanceGraphService,
    TrustPolicyRegistryService,
    TrustScoreEngineService,
    TrustAuditLedgerService,
    DecisionReplayService,
    DecisionExplainabilityService
  ]
})
export class FoundationCompletionPack7Module {}
