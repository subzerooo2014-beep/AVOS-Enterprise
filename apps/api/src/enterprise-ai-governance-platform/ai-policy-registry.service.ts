import { Injectable } from "@nestjs/common";
import type {
  AiGovernancePolicyRecord,
  AiGovernanceEffect,
} from "./enterprise-ai-governance.types";

@Injectable()
export class AiPolicyRegistryService {
  private readonly policies = new Map<string, AiGovernancePolicyRecord>();

  register(
    input: Omit<AiGovernancePolicyRecord, "createdAt" | "updatedAt">,
  ): AiGovernancePolicyRecord {
    const existing = this.policies.get(input.id);
    const now = new Date().toISOString();

    const policy: AiGovernancePolicyRecord = {
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
      )
      .sort((a, b) => a.priority - b.priority);

    const outcome: AiGovernanceEffect =
      matched.find((policy) => policy.effect === "DENY")?.effect ??
      matched.find((policy) => policy.effect === "REVIEW")?.effect ??
      matched.find((policy) => policy.effect === "ALLOW")?.effect ??
      "REVIEW";

    return {
      outcome,
      matchedPolicies: matched.map((policy) => policy.id),
    };
  }

  list(): AiGovernancePolicyRecord[] {
    return Array.from(this.policies.values()).map((policy) =>
      this.clone(policy),
    );
  }

  count(): number {
    return this.policies.size;
  }

  private clone(policy: AiGovernancePolicyRecord): AiGovernancePolicyRecord {
    return {
      ...policy,
      conditions: { ...policy.conditions },
    };
  }
}
