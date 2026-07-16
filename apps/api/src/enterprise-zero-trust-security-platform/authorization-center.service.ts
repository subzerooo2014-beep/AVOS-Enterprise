import { Injectable } from "@nestjs/common";
import { IdentityRegistryService } from "./identity-registry.service";
import type {
  AuthorizationDecision,
  AuthorizationPolicy,
} from "./zero-trust-security.types";

@Injectable()
export class AuthorizationCenterService {
  private readonly policies = new Map<string, AuthorizationPolicy>();
  private readonly decisions: AuthorizationDecision[] = [];

  constructor(private readonly identities: IdentityRegistryService) {}

  registerPolicy(policy: AuthorizationPolicy): AuthorizationPolicy {
    this.policies.set(policy.id, {
      ...policy,
      conditions: { ...policy.conditions },
    });
    return { ...policy, conditions: { ...policy.conditions } };
  }

  decide(
    identityId: string,
    action: string,
    resource: string,
    context: Record<string, unknown> = {},
  ): AuthorizationDecision {
    const identity = this.identities.get(identityId);
    const riskScore = this.calculateRisk(identity, context);

    const matched = Array.from(this.policies.values())
      .filter((policy) => policy.enabled)
      .filter((policy) =>
        Object.entries(policy.conditions).every(([key, value]) => {
          if (key === "action") return action === value;
          if (key === "resource") return resource === value;
          if (key === "identityType") return identity.type === value;
          return context[key] === value;
        }),
      )
      .sort((a, b) => a.priority - b.priority);

    const outcome =
      riskScore >= 80
        ? "DENY"
        : matched.find((item) => item.effect === "DENY")?.effect ??
          matched.find((item) => item.effect === "REVIEW")?.effect ??
          matched.find((item) => item.effect === "ALLOW")?.effect ??
          "REVIEW";

    const decision: AuthorizationDecision = {
      id: `authz-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      identityId,
      action,
      resource,
      outcome,
      matchedPolicies: matched.map((item) => item.id),
      riskScore,
      reasons: [
        `Identity status: ${identity.status}.`,
        `Risk score: ${riskScore}.`,
        matched.length > 0
          ? `Matched ${matched.length} policy record(s).`
          : "No explicit policy matched.",
      ],
      createdAt: new Date().toISOString(),
    };

    this.decisions.unshift(decision);
    if (this.decisions.length > 2000) this.decisions.length = 2000;

    return this.cloneDecision(decision);
  }

  policiesList(): AuthorizationPolicy[] {
    return Array.from(this.policies.values()).map((item) => ({
      ...item,
      conditions: { ...item.conditions },
    }));
  }

  decisionsList(): AuthorizationDecision[] {
    return this.decisions.map((item) => this.cloneDecision(item));
  }

  policyCount(): number {
    return this.policies.size;
  }

  decisionCount(): number {
    return this.decisions.length;
  }

  private calculateRisk(
    identity: { status: string; type: string },
    context: Record<string, unknown>,
  ): number {
    let risk = identity.status === "ACTIVE" ? 0 : 60;
    if (context["untrustedDevice"] === true) risk += 20;
    if (context["unusualLocation"] === true) risk += 15;
    if (context["privilegedAction"] === true) risk += 20;
    return Math.min(100, risk);
  }

  private cloneDecision(item: AuthorizationDecision): AuthorizationDecision {
    return {
      ...item,
      matchedPolicies: [...item.matchedPolicies],
      reasons: [...item.reasons],
    };
  }
}
