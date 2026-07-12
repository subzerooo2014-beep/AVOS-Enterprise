import {
  V5SecurityInput,
  V5ServiceIdentity,
} from "./contracts";

export interface V5ZeroTrustPlan {
  enabled: boolean;
  defaultDecision: "deny";
  identityVerification: string[];
  networkPolicies: string[];
  dataPolicies: string[];
}

export class V5ZeroTrustGenerator {
  identities(input: V5SecurityInput): V5ServiceIdentity[] {
    return input.domains.map((domain) => ({
      serviceKey: `${domain.key}-service`,
      identityType: "workload",
      authMethod:
        domain.criticality === "high"
          ? "mtls"
          : "signed-token",
      rotationRequired: true,
    }));
  }

  plan(input: V5SecurityInput): V5ZeroTrustPlan {
    return {
      enabled: input.enableZeroTrust !== false,
      defaultDecision: "deny",
      identityVerification: [
        "verify workload identity",
        "verify tenant context",
        "verify signed request context",
      ],
      networkPolicies: [
        "deny east-west traffic by default",
        "allow only declared service dependencies",
      ],
      dataPolicies: [
        "encrypt sensitive fields",
        "mask secrets in logs",
        "reject cross-tenant access",
      ],
    };
  }
}
