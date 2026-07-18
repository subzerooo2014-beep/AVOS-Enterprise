import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  AvosFactoryPolicyDecision,
  AvosFactoryPolicyEvaluationContext,
  AvosFactorySecurityPolicy
} from "./avos-factory-security.contracts";
import {
  AvosFactorySecurityPolicyRegistryService
} from "./avos-factory-security-policy-registry.service";
import {
  AvosFactoryAuditService
} from "./avos-factory-audit.service";

@Injectable()
export class AvosFactoryPolicyEvaluationService {
  private readonly decisions: AvosFactoryPolicyDecision[] = [];

  constructor(
    private readonly policies: AvosFactorySecurityPolicyRegistryService,
    private readonly audit: AvosFactoryAuditService
  ) {}

  evaluate(
    context: AvosFactoryPolicyEvaluationContext
  ): AvosFactoryPolicyDecision {
    const matched = this.policies
      .list(true)
      .filter((policy) => this.matches(policy, context));

    const deny = matched.find((policy) => policy.effect === "deny");
    const requireApproval = matched.find(
      (policy) => policy.effect === "require-approval"
    );
    const allow = matched.find((policy) => policy.effect === "allow");

    const effect =
      deny?.effect ??
      requireApproval?.effect ??
      allow?.effect ??
      "deny";

    const decision: AvosFactoryPolicyDecision = {
      id: randomUUID(),
      actor: context.actor,
      resourceType: context.resourceType,
      resourceId: context.resourceId,
      action: context.action,
      allowed: effect === "allow",
      effect,
      matchedPolicyIds: matched.map((policy) => policy.id),
      reasons:
        matched.length > 0
          ? matched.map((policy) => policy.description)
          : ["No matching allow policy was found."],
      requiresHumanApproval: effect === "require-approval",
      evaluatedAt: new Date().toISOString()
    };

    this.decisions.unshift(decision);

    this.audit.append({
      category: "security",
      action: "factory-policy-evaluated",
      actor: context.actor,
      success: decision.allowed,
      resourceId: context.resourceId ?? decision.id,
      details: {
        resourceType: context.resourceType,
        action: context.action,
        effect,
        requiresHumanApproval: decision.requiresHumanApproval
      }
    });

    return structuredClone(decision);
  }

  list(limit = 100): AvosFactoryPolicyDecision[] {
    return this.decisions
      .slice(0, Math.max(1, Math.min(limit, 1000)))
      .map((decision) => structuredClone(decision));
  }

  private matches(
    policy: AvosFactorySecurityPolicy,
    context: AvosFactoryPolicyEvaluationContext
  ): boolean {
    if (
      policy.resourceType !== "*" &&
      policy.resourceType !== context.resourceType
    ) {
      return false;
    }

    if (policy.action !== "*" && policy.action !== context.action) {
      return false;
    }

    const attributes: Record<string, string | number | boolean> = {
      environment: context.environment ?? "",
      ...(context.attributes ?? {})
    };

    return Object.entries(policy.conditions).every(
      ([key, value]) => attributes[key] === value
    );
  }
}
