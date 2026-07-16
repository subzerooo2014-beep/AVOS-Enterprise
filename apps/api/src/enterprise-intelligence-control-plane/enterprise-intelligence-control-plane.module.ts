import { Module } from "@nestjs/common";
import { DecisionObservabilityService } from "./decision-observability.service";
import { DecisionOrchestratorService } from "./decision-orchestrator.service";
import { EnterpriseIntelligenceControlPlaneController } from "./enterprise-intelligence-control-plane.controller";
import { EnterpriseIntelligenceControlPlaneService } from "./enterprise-intelligence-control-plane.service";
import { ExplainabilityService } from "./explainability.service";
import { FeatureStoreService } from "./feature-store.service";
import { IntelligenceCatalogService } from "./intelligence-catalog.service";
import { IntelligenceDiscoveryService } from "./intelligence-discovery.service";
import { IntelligenceGovernanceService } from "./intelligence-governance.service";
import { IntelligenceRuleRegistryService } from "./intelligence-rule-registry.service";
import { ModelRegistryService } from "./model-registry.service";
import { PromptRegistryService } from "./prompt-registry.service";

@Module({
  controllers: [EnterpriseIntelligenceControlPlaneController],
  providers: [
    DecisionObservabilityService,
    DecisionOrchestratorService,
    EnterpriseIntelligenceControlPlaneService,
    ExplainabilityService,
    FeatureStoreService,
    IntelligenceCatalogService,
    IntelligenceDiscoveryService,
    IntelligenceGovernanceService,
    IntelligenceRuleRegistryService,
    ModelRegistryService,
    PromptRegistryService,
  ],
  exports: [
    DecisionObservabilityService,
    DecisionOrchestratorService,
    EnterpriseIntelligenceControlPlaneService,
    ExplainabilityService,
    FeatureStoreService,
    IntelligenceCatalogService,
    IntelligenceDiscoveryService,
    IntelligenceGovernanceService,
    IntelligenceRuleRegistryService,
    ModelRegistryService,
    PromptRegistryService,
  ],
})
export class EnterpriseIntelligenceControlPlaneModule {}
