import { Injectable } from "@nestjs/common";
import type { SecurityPolicyRecord } from "./enterprise-security-governance-control-plane.types";

@Injectable()
export class SecurityPolicyRegistryService {
  private readonly policies = new Map<string, SecurityPolicyRecord>();

  register(policy: SecurityPolicyRecord): SecurityPolicyRecord {
    this.policies.set(policy.id, {
      ...policy,
      conditions: { ...policy.conditions },
    });

    return { ...policy, conditions: { ...policy.conditions } };
  }

  list(domain?: string): SecurityPolicyRecord[] {
    return Array.from(this.policies.values())
      .filter((policy) => (domain ? policy.domain === domain : true))
      .map((policy) => ({
        ...policy,
        conditions: { ...policy.conditions },
      }))
      .sort((a, b) => a.priority - b.priority);
  }

  enabled(domain?: string): SecurityPolicyRecord[] {
    return this.list(domain).filter((policy) => policy.enabled);
  }

  count(): number {
    return this.policies.size;
  }
}
