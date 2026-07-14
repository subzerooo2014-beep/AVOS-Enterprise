import { Injectable } from '@nestjs/common';
import { ApiEndpointProfile } from './global-ecosystem-intelligence.types';

@Injectable()
export class EnterpriseApiIntelligenceHubService {
  analyze(endpoints: ApiEndpointProfile[]) {
    const profiles = endpoints
      .map((endpoint) => {
        const health =
          endpoint.securityScore * 0.4 +
          Math.max(0, 100 - endpoint.errorRate) * 0.35 +
          Math.max(0, 100 - endpoint.latencyMs / 10) * 0.25;

        return {
          ...endpoint,
          health: Math.round(Math.max(0, Math.min(100, health))),
        };
      })
      .sort((left, right) => right.health - left.health);

    return {
      profiles,
      healthyEndpoints: profiles
        .filter((profile) => profile.health >= 70)
        .map((profile) => profile.id),
      unhealthyEndpoints: profiles
        .filter((profile) => profile.health < 70)
        .map((profile) => profile.id),
    };
  }
}