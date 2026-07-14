import { Injectable } from '@nestjs/common';
import {
  ApiEndpointProfile,
  EcosystemPartner,
} from './global-ecosystem-intelligence.types';

@Injectable()
export class GlobalIntegrationOrchestratorService {
  orchestrate(
    partners: EcosystemPartner[],
    endpoints: ApiEndpointProfile[],
  ) {
    const integrations = partners.map((partner) => {
      const partnerEndpoints = endpoints.filter(
        (endpoint) => endpoint.partnerId === partner.id,
      );
      const health =
        partnerEndpoints.reduce(
          (sum, endpoint) =>
            sum +
            endpoint.securityScore * 0.4 +
            Math.max(0, 100 - endpoint.errorRate) * 0.35 +
            Math.max(0, 100 - endpoint.latencyMs / 10) * 0.25,
          0,
        ) / Math.max(1, partnerEndpoints.length);

      return {
        partnerId: partner.id,
        endpointCount: partnerEndpoints.length,
        integrationHealth: Math.round(Math.max(0, Math.min(100, health))),
        ready: health >= 70,
      };
    });

    return {
      integrations,
      readyPartners: integrations
        .filter((integration) => integration.ready)
        .map((integration) => integration.partnerId),
    };
  }
}