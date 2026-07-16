import { Injectable } from "@nestjs/common";
import type { AiPolicyRecord } from "./enterprise-autonomous-ai.types";

@Injectable()
export class AiPolicyEngineService {
  private readonly policies = new Map<string, AiPolicyRecord>();

  register(policy: AiPolicyRecord): AiPolicyRecord {
    this.policies.set(policy.id, {
      ...policy,
      conditions: { ...policy.conditions },
    });
    return { ...policy, conditions: { ...policy.conditions } };
  }

  evaluate(context: Record<string, unknown>) {
    const matched = Array.from(this.policies.values())
      .filter((policy) => policy.enabled)
      .filter((policy) =>
        Object.entries(policy.conditions).every(
          ([key, value]) => context[key] === value,
        ),
      );

    const outcome =
      matched.find((policy) => policy.effect === "DENY")?.effect ??
      matched.find((policy) => policy.effect === "REVIEW")?.effect ??
      "ALLOW";

    return {
      outcome,
      matchedPolicies: matched.map((policy) => policy.id),
    };
  }

  list(): AiPolicyRecord[] {
    return Array.from(this.policies.values()).map((policy) => ({
      ...policy,
      conditions: { ...policy.conditions },
    }));
  }

  count(): number {
    return this.policies.size;
  }
}
