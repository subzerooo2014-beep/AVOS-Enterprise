import { Injectable } from '@nestjs/common';
import { IntegrationConnector } from './enterprise-integration-federation.types';

@Injectable()
export class MultiCloudIntegrationCoordinatorService {
  coordinate(connectors: IntegrationConnector[]) {
    const byRegion = new Map<string, IntegrationConnector[]>();

    for (const connector of connectors) {
      const existing = byRegion.get(connector.region) ?? [];
      existing.push(connector);
      byRegion.set(connector.region, existing);
    }

    const regions = [...byRegion.entries()].map(
      ([region, regionConnectors]) => ({
        region,
        connectors: regionConnectors.map((connector) => connector.id),
        health: Math.round(
          regionConnectors.reduce(
            (sum, connector) => sum + connector.healthScore,
            0,
          ) / Math.max(1, regionConnectors.length),
        ),
      }),
    );

    return {
      regions,
      connectedRegions: regions.length,
      healthyRegions: regions
        .filter((region) => region.health >= 70)
        .map((region) => region.region),
    };
  }
}