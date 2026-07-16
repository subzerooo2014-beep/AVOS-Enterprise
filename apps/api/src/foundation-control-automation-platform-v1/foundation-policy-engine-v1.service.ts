import { Injectable } from "@nestjs/common";
import type { FoundationPolicyV1 } from "./foundation-control-automation-v1.types";

@Injectable()
export class FoundationPolicyEngineV1Service {
  private readonly policies = new Map<string, FoundationPolicyV1>();

  upsert(
    input: Omit<FoundationPolicyV1, "version" | "createdAt" | "updatedAt">,
  ): FoundationPolicyV1 {
    const existing = this.policies.get(input.id);
    const now = new Date().toISOString();

    const policy: FoundationPolicyV1 = {
      ...input,
      conditions: { ...input.conditions },
      version: (existing?.version ?? 0) + 1,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };

    this.policies.set(policy.id, policy);
    return this.clone(policy);
  }

  evaluate(
    subject: string,
    action: string,
    resource: string,
    context: Record<string, unknown> = {},
  ): { allowed: boolean; matchedPolicies: FoundationPolicyV1[] } {
    const matched = this.list().filter((policy) => {
      if (!policy.enabled) return false;
      if (policy.subject !== "*" && policy.subject !== subject) return false;
      if (policy.action !== "*" && policy.action !== action) return false;
      if (policy.resource !== "*" && policy.resource !== resource) return false;

      return Object.entries(policy.conditions).every(
        ([key, value]) => context[key] === value,
      );
    });

    const denied = matched.some((policy) => policy.effect === "DENY");
    const allowed = matched.some((policy) => policy.effect === "ALLOW");

    return {
      allowed: allowed && !denied,
      matchedPolicies: matched,
    };
  }

  list(): FoundationPolicyV1[] {
    return Array.from(this.policies.values()).map((policy) => this.clone(policy));
  }

  count(): number {
    return this.policies.size;
  }

  private clone(policy: FoundationPolicyV1): FoundationPolicyV1 {
    return { ...policy, conditions: { ...policy.conditions } };
  }
}
