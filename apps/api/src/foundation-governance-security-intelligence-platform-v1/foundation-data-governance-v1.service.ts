import { Injectable } from "@nestjs/common";
import type { FoundationDataGovernancePolicyV1 } from "./foundation-governance-security-intelligence-v1.types";

@Injectable()
export class FoundationDataGovernanceV1Service {
  private readonly policies = new Map<string, FoundationDataGovernancePolicyV1>();

  upsert(
    input: Omit<FoundationDataGovernancePolicyV1, "updatedAt">,
  ): FoundationDataGovernancePolicyV1 {
    const policy: FoundationDataGovernancePolicyV1 = {
      ...input,
      residency: [...input.residency],
      updatedAt: new Date().toISOString(),
    };

    this.policies.set(policy.id, policy);
    return this.clone(policy);
  }

  evaluate(
    id: string,
    residency: string,
    retentionDays: number,
  ): { compliant: boolean; reasons: string[] } {
    const policy = this.policies.get(id);
    const reasons: string[] = [];

    if (!policy || !policy.enabled) {
      return { compliant: false, reasons: ["Governance policy is missing or disabled."] };
    }

    if (policy.residency.length > 0 && !policy.residency.includes(residency)) {
      reasons.push(`Residency '${residency}' is not allowed.`);
    }

    if (retentionDays > policy.retentionDays) {
      reasons.push(`Retention exceeds ${policy.retentionDays} days.`);
    }

    return {
      compliant: reasons.length === 0,
      reasons,
    };
  }

  list(): FoundationDataGovernancePolicyV1[] {
    return Array.from(this.policies.values()).map((item) => this.clone(item));
  }

  count(): number {
    return this.policies.size;
  }

  private clone(
    item: FoundationDataGovernancePolicyV1,
  ): FoundationDataGovernancePolicyV1 {
    return { ...item, residency: [...item.residency] };
  }
}
