import { Injectable } from "@nestjs/common";
import { SecurityPolicyRegistryService } from "./security-policy-registry.service";
import { SecurityRiskEngineService } from "./security-risk-engine.service";
import type {
  AccessDecisionRequest,
  AccessDecisionResult,
  SecurityPolicyRecord,
} from "./enterprise-security-governance-control-plane.types";

@Injectable()
export class AccessDecisionService {
  private readonly decisions: AccessDecisionResult[] = [];

  constructor(
    private readonly policies: SecurityPolicyRegistryService,
    private readonly riskEngine: SecurityRiskEngineService,
  ) {}

  decide(request: AccessDecisionRequest): AccessDecisionResult {
    const applicable = this.policies
      .enabled()
      .filter((policy) => this.matches(policy, request));

    const riskScore = this.riskEngine.score(request.context ?? {});
    const highestPriority = applicable[0];

    const outcome =
      riskScore >= 80
        ? "DENY"
        : highestPriority?.effect ??
          (riskScore >= 50 ? "REVIEW" : "ALLOW");

    const result: AccessDecisionResult = {
      id: `access-decision-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 10)}`,
      subject: request.subject,
      action: request.action,
      resource: request.resource,
      outcome,
      appliedPolicies: applicable.map((policy) => policy.id),
      riskScore,
      reasons: [
        highestPriority
          ? `Matched policy '${highestPriority.name}'.`
          : "No explicit policy matched.",
        `Calculated risk score: ${riskScore}.`,
      ],
      createdAt: new Date().toISOString(),
    };

    this.decisions.unshift(result);
    if (this.decisions.length > 1000) this.decisions.length = 1000;

    return { ...result, appliedPolicies: [...result.appliedPolicies], reasons: [...result.reasons] };
  }

  list(): AccessDecisionResult[] {
    return this.decisions.map((item) => ({
      ...item,
      appliedPolicies: [...item.appliedPolicies],
      reasons: [...item.reasons],
    }));
  }

  private matches(
    policy: SecurityPolicyRecord,
    request: AccessDecisionRequest,
  ): boolean {
    return Object.entries(policy.conditions).every(([key, value]) => {
      if (key === "action") return request.action === value;
      if (key === "resource") return request.resource === value;
      if (key === "subject") return request.subject === value;
      return request.context?.[key] === value;
    });
  }
}
