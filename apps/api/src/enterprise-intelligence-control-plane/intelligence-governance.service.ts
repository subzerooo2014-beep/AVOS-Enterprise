import { Injectable } from "@nestjs/common";
import { IntelligenceCatalogService } from "./intelligence-catalog.service";
import { IntelligenceRuleRegistryService } from "./intelligence-rule-registry.service";
import { ModelRegistryService } from "./model-registry.service";
import { PromptRegistryService } from "./prompt-registry.service";

@Injectable()
export class IntelligenceGovernanceService {
  constructor(
    private readonly catalog: IntelligenceCatalogService,
    private readonly rules: IntelligenceRuleRegistryService,
    private readonly models: ModelRegistryService,
    private readonly prompts: PromptRegistryService,
  ) {}

  validate() {
    const violations: {
      code: string;
      component: string;
      message: string;
    }[] = [];

    for (const component of this.catalog.list()) {
      if (component.type === "UNKNOWN") {
        violations.push({
          code: "INTELLIGENCE_COMPONENT_UNKNOWN",
          component: component.id,
          message: "Intelligence component type could not be classified.",
        });
      }
    }

    for (const rule of this.rules.list()) {
      if (!rule.version) {
        violations.push({
          code: "INTELLIGENCE_RULE_VERSION_MISSING",
          component: rule.id,
          message: "Rule version is missing.",
        });
      }
    }

    for (const model of this.models.list()) {
      if (!model.version) {
        violations.push({
          code: "INTELLIGENCE_MODEL_VERSION_MISSING",
          component: model.id,
          message: "Model version is missing.",
        });
      }
    }

    for (const prompt of this.prompts.list()) {
      if (!prompt.version) {
        violations.push({
          code: "INTELLIGENCE_PROMPT_VERSION_MISSING",
          component: prompt.id,
          message: "Prompt version is missing.",
        });
      }
    }

    return {
      compliant: violations.length === 0,
      score: Math.max(0, 100 - violations.length * 5),
      checkedAt: new Date().toISOString(),
      violations,
    };
  }
}
