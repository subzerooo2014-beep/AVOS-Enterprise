import { V5DistributedRuntimeResult } from "./orchestrator";

export interface V5DistributedRuntimeHealth {
  healthy: boolean;
  status: string;
  score: number;
  services: number;
  gatewayRoutes: number;
  eventContracts: number;
  sagas: number;
  serviceContracts: number;
  discoveryEnabled: boolean;
  observabilityEnabled: boolean;
  secretsEnabled: boolean;
  integrationServiceTests: number;
  integrationGatewayTests: number;
  evidenceCount: number;
}

export class GenesisV5DistributedRuntimeVerifier {
  verify(
    result: V5DistributedRuntimeResult,
  ): V5DistributedRuntimeHealth {
    return {
      healthy:
        result.success &&
        result.score >= 80 &&
        result.services.length > 0 &&
        result.gatewayRoutes.length === result.services.length &&
        result.eventContracts.length > 0 &&
        result.serviceContracts.length === result.services.length &&
        result.serviceDiscovery.enabled &&
        result.observability.enabled,
      status: result.status,
      score: result.score,
      services: result.services.length,
      gatewayRoutes: result.gatewayRoutes.length,
      eventContracts: result.eventContracts.length,
      sagas: result.sagas.length,
      serviceContracts: result.serviceContracts.length,
      discoveryEnabled: result.serviceDiscovery.enabled,
      observabilityEnabled: result.observability.enabled,
      secretsEnabled: result.secrets.enabled,
      integrationServiceTests:
        result.integrationTests.serviceTests.length,
      integrationGatewayTests:
        result.integrationTests.gatewayTests.length,
      evidenceCount: result.evidence.length,
    };
  }
}
