import { V5BusinessRuntimeResult } from "./orchestrator";

export interface V5BusinessRuntimeHealth {
  healthy: boolean;
  status: string;
  score: number;
  catalogPolicies: number;
  commissionPolicies: number;
  ledgerAccounts: number;
  settlementFlows: number;
  kpis: number;
  complianceControls: number;
  integrationContracts: number;
  apiProducts: number;
  fraudPolicies: number;
  dataGovernanceEnabled: boolean;
  evidenceCount: number;
}

export class GenesisV5BusinessRuntimeVerifier {
  verify(
    result: V5BusinessRuntimeResult,
  ): V5BusinessRuntimeHealth {
    return {
      healthy:
        result.success &&
        result.score >= 80 &&
        result.catalogPolicies.length > 0 &&
        result.commissionPolicies.length > 0 &&
        result.ledgerAccounts.length > 0 &&
        result.settlementFlows.length > 0 &&
        result.kpis.length > 0 &&
        result.complianceControls.length > 0 &&
        result.dataGovernance.enabled,
      status: result.status,
      score: result.score,
      catalogPolicies: result.catalogPolicies.length,
      commissionPolicies: result.commissionPolicies.length,
      ledgerAccounts: result.ledgerAccounts.length,
      settlementFlows: result.settlementFlows.length,
      kpis: result.kpis.length,
      complianceControls: result.complianceControls.length,
      integrationContracts: result.integrationContracts.length,
      apiProducts: result.apiProducts.length,
      fraudPolicies: result.fraudPolicies.length,
      dataGovernanceEnabled: result.dataGovernance.enabled,
      evidenceCount: result.evidence.length,
    };
  }
}
