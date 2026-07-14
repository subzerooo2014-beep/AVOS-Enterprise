import { Injectable } from '@nestjs/common';
import { IntegrationConnector } from './enterprise-integration-federation.types';

@Injectable()
export class GlobalConnectivityCenterService {
  private readonly connectors = new Map<string, IntegrationConnector>();

  register(connector: IntegrationConnector) {
    this.connectors.set(connector.id, { ...connector });
    return { ...connector };
  }

  summary() {
    const connectors = [...this.connectors.values()];
    return {
      total: connectors.length,
      active: connectors.filter((connector) => connector.status === 'active')
        .length,
      degraded: connectors.filter(
        (connector) => connector.status === 'degraded',
      ).length,
      connectedRegions: [
        ...new Set(connectors.map((connector) => connector.region)),
      ],
      connectedSystems: [
        ...new Set(connectors.map((connector) => connector.system)),
      ],
    };
  }
}