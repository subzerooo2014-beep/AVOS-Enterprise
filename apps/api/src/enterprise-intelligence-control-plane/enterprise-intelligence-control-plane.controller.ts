import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { DecisionOrchestratorService } from "./decision-orchestrator.service";
import { EnterpriseIntelligenceControlPlaneService } from "./enterprise-intelligence-control-plane.service";
import { ExplainabilityService } from "./explainability.service";
import { FeatureStoreService } from "./feature-store.service";
import { IntelligenceCatalogService } from "./intelligence-catalog.service";
import { IntelligenceRuleRegistryService } from "./intelligence-rule-registry.service";
import { ModelRegistryService } from "./model-registry.service";
import { PromptRegistryService } from "./prompt-registry.service";
import { DecisionObservabilityService } from "./decision-observability.service";
import type {
  DecisionRequest,
  IntelligenceModelRecord,
  IntelligenceRule,
  PromptTemplateRecord,
} from "./enterprise-intelligence-control-plane.types";

@Controller("enterprise-intelligence-control-plane")
export class EnterpriseIntelligenceControlPlaneController {
  constructor(
    private readonly controlPlane: EnterpriseIntelligenceControlPlaneService,
    private readonly catalog: IntelligenceCatalogService,
    private readonly orchestrator: DecisionOrchestratorService,
    private readonly rules: IntelligenceRuleRegistryService,
    private readonly models: ModelRegistryService,
    private readonly prompts: PromptRegistryService,
    private readonly features: FeatureStoreService,
    private readonly observability: DecisionObservabilityService,
    private readonly explainability: ExplainabilityService,
  ) {}

  @Get("status")
  status() {
    return this.controlPlane.health();
  }

  @Get("diagnostics")
  diagnostics() {
    return this.controlPlane.diagnostics();
  }

  @Post("catalog/refresh")
  refreshCatalog() {
    const items = this.catalog.refresh();
    return { success: true, discovered: items.length, items };
  }

  @Post("decisions")
  decide(@Body() body: DecisionRequest) {
    const decision = this.orchestrator.decide(body);
    return {
      success: true,
      decision,
      explanation: this.explainability.explain(decision),
    };
  }

  @Get("decisions")
  decisions() {
    return { success: true, items: this.observability.list() };
  }

  @Post("rules")
  registerRule(@Body() body: IntelligenceRule) {
    return { success: true, rule: this.rules.register(body) };
  }

  @Post("models")
  registerModel(@Body() body: IntelligenceModelRecord) {
    return { success: true, model: this.models.register(body) };
  }

  @Post("prompts")
  registerPrompt(@Body() body: PromptTemplateRecord) {
    return { success: true, prompt: this.prompts.register(body) };
  }

  @Post("features/:entityId/:key")
  setFeature(
    @Param("entityId") entityId: string,
    @Param("key") key: string,
    @Body() body: { value: unknown },
  ) {
    return {
      success: true,
      feature: this.features.set(entityId, key, body.value),
    };
  }

  @Get("features/:entityId")
  listFeatures(@Param("entityId") entityId: string) {
    return { success: true, items: this.features.list(entityId) };
  }
}
