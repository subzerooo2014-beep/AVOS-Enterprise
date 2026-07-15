import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { LegalOperationPolicy } from "./enterprise-foundations.types";

@Injectable()
export class LegalGlobalFoundationService {
  private readonly policies = new Map<string, LegalOperationPolicy>();

  registerPolicy(
    input: Omit<LegalOperationPolicy, "id" | "createdAt" | "updatedAt">,
  ): LegalOperationPolicy {
    const now = new Date().toISOString();

    const policy: LegalOperationPolicy = {
      ...input,
      id: randomUUID(),
      metadata: { ...input.metadata },
      createdAt: now,
      updatedAt: now,
    };

    this.policies.set(policy.id, policy);
    return this.clone(policy);
  }

  evaluate(
    jurisdiction: string,
    policyKey: string,
    at: string,
  ) {
    const timestamp = new Date(at).getTime();

    const candidates = Array.from(this.policies.values()).filter(
      (policy) =>
        policy.active &&
        policy.jurisdiction === jurisdiction &&
        policy.policyKey === policyKey &&
        new Date(policy.effectiveFrom).getTime() <= timestamp,
    );

    const latest = candidates.sort((a, b) =>
      b.version.localeCompare(a.version),
    )[0];

    return {
      jurisdiction,
      policyKey,
      allowed: Boolean(latest),
      policy: latest ? this.clone(latest) : undefined,
      evaluatedAt: new Date().toISOString(),
    };
  }

  dashboard() {
    const policies = Array.from(this.policies.values());

    return {
      policies: policies.length,
      activePolicies: policies.filter((item) => item.active).length,
      jurisdictions: new Set(
        policies.map((item) => item.jurisdiction),
      ).size,
      residencyRegions: new Set(
        policies
          .map((item) => item.dataResidencyRegion)
          .filter(Boolean),
      ).size,
      retentionPolicies: policies.filter(
        (item) => item.retentionDays !== undefined,
      ).length,
      generatedAt: new Date().toISOString(),
    };
  }

  private clone(
    policy: LegalOperationPolicy,
  ): LegalOperationPolicy {
    return {
      ...policy,
      metadata: { ...policy.metadata },
    };
  }
}