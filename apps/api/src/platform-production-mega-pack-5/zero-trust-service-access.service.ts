import { Injectable } from "@nestjs/common";
import { RuntimeIdentityService } from "./runtime-identity.service";
import { AuthorizationPoliciesService } from "./authorization-policies.service";
import { SecurityAuditService } from "./security-audit.service";

@Injectable()
export class ZeroTrustServiceAccessService {
  constructor(
    private readonly identities: RuntimeIdentityService,
    private readonly policies: AuthorizationPoliciesService,
    private readonly audit: SecurityAuditService,
  ) {}

  evaluate(input: {
    identityId: string;
    resource: string;
    action: string;
    environment: string;
  }): Record<string, unknown> {
    const identity = this.identities.get(input.identityId);

    if (identity.status !== "active") {
      return {
        decision: "deny",
        reason: "Runtime identity is not active.",
      };
    }

    if (identity.environment !== input.environment) {
      return {
        decision: "deny",
        reason: "Environment mismatch.",
      };
    }

    const policyDecision = this.policies.evaluate({
      subject: identity.runtimeKey,
      resource: input.resource,
      action: input.action,
      environment: input.environment,
    });

    this.audit.record({
      category: "zero-trust",
      action: "access-evaluation",
      actor: identity.runtimeKey,
      subject: input.resource,
      outcome: String(policyDecision.decision),
      metadata: input,
    });

    return {
      identityId: identity.id,
      trustDomain: identity.trustDomain,
      continuouslyVerified: true,
      leastPrivilege: true,
      policyDecision,
    };
  }
}