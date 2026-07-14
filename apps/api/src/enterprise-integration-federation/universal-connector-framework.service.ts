import { Injectable } from '@nestjs/common';
import { IntegrationConnector } from './enterprise-integration-federation.types';

@Injectable()
export class UniversalConnectorFrameworkService {
  normalize(connector: IntegrationConnector) {
    return {
      ...connector,
      protocol: connector.protocol.toLowerCase(),
      normalizedSystem: connector.system.trim().toLowerCase(),
      ready:
        connector.status === 'active' &&
        connector.healthScore >= 70 &&
        connector.trustScore >= 70,
    };
  }

  createAdapter(connector: IntegrationConnector) {
    const normalized = this.normalize(connector);
    return {
      connectorId: connector.id,
      adapterId: `adapter-${connector.id}`,
      protocol: normalized.protocol,
      system: normalized.normalizedSystem,
      capabilities: ['connect', 'read', 'write', 'health-check'],
      ready: normalized.ready,
    };
  }
}