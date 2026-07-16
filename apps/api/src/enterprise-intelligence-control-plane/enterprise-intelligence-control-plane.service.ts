import { Injectable } from "@nestjs/common";
import { DecisionObservabilityService } from "./decision-observability.service";
import { FeatureStoreService } from "./feature-store.service";
import { IntelligenceCatalogService } from "./intelligence-catalog.service";
import { IntelligenceGovernanceService } from "./intelligence-governance.service";
import { IntelligenceRuleRegistryService } from "./intelligence-rule-registry.service";
import { ModelRegistryService } from "./model-registry.service";
import { PromptRegistryService } from "./prompt-registry.service";
import type {
  IntelligenceHealth,
  IntelligenceMetrics,
} from "./enterprise-intelligence-control-plane.types";

@Injectable()
export class EnterpriseIntelligenceControlPlaneService {
  constructor(
    private readonly catalog: IntelligenceCatalogService,
    private readonly decisions: DecisionObservabilityService,
    private readonly rules: IntelligenceRuleRegistryService,
    private readonly models: ModelRegistryService,
    private readonly prompts: PromptRegistryService,
    private readonly features: FeatureStoreService,
    private readonly governance: IntelligenceGovernanceService,
  ) {}

  metrics(): IntelligenceMetrics {
    const analytics = this.decisions.analytics();

    return {
      components: this.catalog.count(),
      decisions: analytics.decisions,
      approvals: analytics.approvals,
      rejections: analytics.rejections,
      reviews: analytics.reviews,
      rules: this.rules.count(),
      models: this.models.count(),
      prompts: this.prompts.count(),
      features: this.features.count(),
    };
  }

  health(): IntelligenceHealth {
    const governance = this.governance.validate();

    return {
      success: true,
      system: "AVOS Enterprise Intelligence Control Plane",
      version: "1.0.0",
      status: governance.compliant ? "READY" : "DEGRADED",
      metrics: this.metrics(),
      components: {
        discovery: "READY",
        catalog: "READY",
        decisionOrchestration: "READY",
        ruleRegistry: "READY",
        modelRegistry: "READY",
        promptRegistry: "READY",
        featureStore: "READY",
        explainability: "READY",
        observability: "READY",
        analytics: "READY",
        governance: governance.compliant ? "READY" : "DEGRADED",
        existingAiIntegration: "INTEGRATION_READY",
      },
    };
  }

  diagnostics() {
    return {
      success: true,
      health: this.health(),
      catalog: this.catalog.status(),
      decisions: this.decisions.list(),
      rules: this.rules.list(),
      models: this.models.list(),
      prompts: this.prompts.list(),
      features: this.features.list(),
      governance: this.governance.validate(),
    };
  }
}
