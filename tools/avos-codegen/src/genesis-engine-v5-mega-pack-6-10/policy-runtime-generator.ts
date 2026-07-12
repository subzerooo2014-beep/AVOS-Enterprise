import {
  V5AccessPolicy,
  V5QuotaPolicy,
  V5SecurityInput,
} from "./contracts";

export interface V5PolicyDecisionRuntime {
  engine: "embedded-pdp";
  defaultEffect: "deny";
  cacheEnabled: boolean;
  cacheTtlSeconds: number;
  decisionEvidenceEnabled: boolean;
}

export class V5PolicyRuntimeGenerator {
  runtime(): V5PolicyDecisionRuntime {
    return {
      engine: "embedded-pdp",
      defaultEffect: "deny",
      cacheEnabled: true,
      cacheTtlSeconds: 30,
      decisionEvidenceEnabled: true,
    };
  }

  quotas(input: V5SecurityInput): V5QuotaPolicy[] {
    if (input.enableQuotas === false) return [];

    return [
      {
        scope: "tenant",
        key: "tenant-api-requests",
        limit: 10000,
        windowSeconds: 3600,
      },
      {
        scope: "user",
        key: "user-mutations",
        limit: 500,
        windowSeconds: 3600,
      },
      {
        scope: "service",
        key: "service-events",
        limit: 50000,
        windowSeconds: 60,
      },
    ];
  }

  summarize(policies: readonly V5AccessPolicy[]): Record<string, number> {
    return {
      total: policies.length,
      allow: policies.filter((policy) => policy.effect === "allow").length,
      deny: policies.filter((policy) => policy.effect === "deny").length,
      review: policies.filter((policy) => policy.effect === "review").length,
    };
  }
}
