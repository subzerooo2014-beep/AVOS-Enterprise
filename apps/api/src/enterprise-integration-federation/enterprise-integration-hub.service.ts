import { Injectable } from '@nestjs/common';
import { IntegrationConnector } from './enterprise-integration-federation.types';

@Injectable()
export class EnterpriseIntegrationHubService {
  private readonly connectors = new Map<string, IntegrationConnector>();

  register(connector: IntegrationConnector): IntegrationConnector {
    this.connectors.set(connector.id, { ...connector });
    return { ...connector };
  }

  list(): IntegrationConnector[] {
    return [...this.connectors.values()].map((connector) => ({
      ...connector,
    }));
  }

  summary() {
    const connectors = this.list();
    return {
      total: connectors.length,
      active: connectors.filter((connector) => connector.status === 'active')
        .length,
      degraded: connectors.filter(
        (connector) => connector.status === 'degraded',
      ).length,
      regions: [...new Set(connectors.map((connector) => connector.region))],
      protocols: [
        ...new Set(connectors.map((connector) => connector.protocol)),
      ],
    };
  }
}