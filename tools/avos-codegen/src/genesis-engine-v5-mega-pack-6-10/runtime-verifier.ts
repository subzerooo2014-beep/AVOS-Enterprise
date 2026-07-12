import { V5SecurityRuntimeResult } from "./orchestrator";

export interface V5SecurityRuntimeHealth {
  healthy: boolean;
  status: string;
  score: number;
  tenantRules: number;
  accessPolicies: number;
  serviceIdentities: number;
  quotas: number;
  auditEvents: number;
  zeroTrustEnabled: boolean;
  policyDecisionEvidence: boolean;
  evidenceCount: number;
}

export class GenesisV5SecurityRuntimeVerifier {
  verify(
    result: V5SecurityRuntimeResult,
  ): V5SecurityRuntimeHealth {
    return {
      healthy:
        result.success &&
        result.score >= 80 &&
        result.tenantScopeRules.length > 0 &&
        result.accessPolicies.length > 0 &&
        result.serviceIdentities.length > 0 &&
        result.zeroTrustPlan.enabled &&
        result.policyDecisionRuntime.decisionEvidenceEnabled,
      status: result.status,
      score: result.score,
      tenantRules: result.tenantScopeRules.length,
      accessPolicies: result.accessPolicies.length,
      serviceIdentities: result.serviceIdentities.length,
      quotas: result.quotas.length,
      auditEvents: result.auditEvents.length,
      zeroTrustEnabled: result.zeroTrustPlan.enabled,
      policyDecisionEvidence:
        result.policyDecisionRuntime.decisionEvidenceEnabled,
      evidenceCount: result.evidence.length,
    };
  }
}
