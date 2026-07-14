import { Injectable } from '@nestjs/common';
import {
  FederationNode,
  IntegrationConnector,
} from './enterprise-integration-federation.types';

@Injectable()
export class ExternalSystemTrustManagerService {
  evaluate(
    connectors: IntegrationConnector[],
    nodes: FederationNode[],
  ) {
    const connectorTrust =
      connectors.reduce(
        (sum, connector) => sum + connector.trustScore,
        0,
      ) / Math.max(1, connectors.length);
    const federationTrust =
      nodes.reduce((sum, node) => sum + node.trustScore, 0) /
      Math.max(1, nodes.length);

    return {
      connectorTrust: Math.round(connectorTrust),
      federationTrust: Math.round(federationTrust),
      globalTrust: Math.round(
        connectorTrust * 0.6 + federationTrust * 0.4,
      ),
      blockedConnectors: connectors
        .filter((connector) => connector.trustScore < 60)
        .map((connector) => connector.id),
      blockedNodes: nodes
        .filter((node) => node.trustScore < 60)
        .map((node) => node.id),
    };
  }
}