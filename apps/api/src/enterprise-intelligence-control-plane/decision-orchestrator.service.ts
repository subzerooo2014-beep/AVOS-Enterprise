import { Injectable } from "@nestjs/common";
import { DecisionObservabilityService } from "./decision-observability.service";
import { IntelligenceRuleRegistryService } from "./intelligence-rule-registry.service";
import { ModelRegistryService } from "./model-registry.service";
import type {
  DecisionRequest,
  DecisionResult,
  IntelligenceRule,
} from "./enterprise-intelligence-control-plane.types";

@Injectable()
export class DecisionOrchestratorService {
  constructor(
    private readonly rules: IntelligenceRuleRegistryService,
    private readonly models: ModelRegistryService,
    private readonly observability: DecisionObservabilityService,
  ) {}

  decide(request: DecisionRequest): DecisionResult {
    const requestId =
      request.id ??
      `decision-request-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 10)}`;

    const matchedRules = this.rules
      .enabled(request.domain)
      .filter((rule) => this.matches(rule, request.context));

    const highestPriority = matchedRules[0];
    const model = this.models.activeFor(request.action);

    const result: DecisionResult = {
      id: `decision-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      requestId,
      domain: request.domain,
      action: request.action,
      outcome: highestPriority?.effect ?? "REVIEW",
      confidence: highestPriority ? 0.95 : model ? 0.75 : 0.5,
      reasons: highestPriority
        ? [`Matched rule '${highestPriority.name}'.`]
        : model
          ? [`Model '${model.name}' selected for assisted decision.`]
          : ["No explicit rule or active model was available."],
      appliedRules: matchedRules.map((rule) => rule.id),
      modelId: model?.id,
      createdAt: new Date().toISOString(),
    };

    return this.observability.record(result);
  }

  private matches(
    rule: IntelligenceRule,
    context: Record<string, unknown>,
  ): boolean {
    return Object.entries(rule.condition).every(
      ([key, value]) => context[key] === value,
    );
  }
}
