import { Injectable } from "@nestjs/common";
import type { CloudGovernancePolicyRecord } from "./enterprise-global-cloud.types";

@Injectable()
export class CloudGovernanceService {
  private readonly policies = new Map<string, CloudGovernancePolicyRecord>();

  register(
    input: Omit<CloudGovernancePolicyRecord, "createdAt" | "updatedAt">,
  ): CloudGovernancePolicyRecord {
    const existing = this.policies.get(input.id);
    const now = new Date().toISOString();

    const policy: CloudGovernancePolicyRecord = {
      ...input,
      conditions: { ...input.conditions },
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };

    this.policies.set(policy.id, policy);
    return this.clone(policy);
  }

  evaluate(context: Record<string, unknown>) {
    const matched = this.list()
      .filter((policy) => policy.enabled)
      .filter((policy) =>
        Object.entries(policy.conditions).every(
          ([key, value]) => context[key] === value,
        ),
      );

    const outcome =
      matched.find((policy) => policy.effect === "DENY")?.effect ??
      matched.find((policy) => policy.effect === "REVIEW")?.effect ??
      matched.find((policy) => policy.effect === "ALLOW")?.effect ??
      "ALLOW";

    return {
      outcome,
      matchedPolicies: matched.map((policy) => policy.id),
    };
  }

  list(): CloudGovernancePolicyRecord[] {
    return Array.from(this.policies.values()).map((policy) =>
      this.clone(policy),
    );
  }

  count(): number {
    return this.policies.size;
  }

  private clone(
    policy: CloudGovernancePolicyRecord,
  ): CloudGovernancePolicyRecord {
    return {
      ...policy,
      conditions: { ...policy.conditions },
    };
  }
}
