import { Injectable } from '@nestjs/common';
import {
  ApiGatewayRoute,
  IntegrationConnector,
} from './enterprise-integration-federation.types';

@Injectable()
export class EnterpriseIntegrationSecurityLayerService {
  assess(
    connectors: IntegrationConnector[],
    routes: ApiGatewayRoute[],
  ) {
    const connectorSecurity =
      connectors.reduce(
        (sum, connector) => sum + connector.trustScore,
        0,
      ) / Math.max(1, connectors.length);
    const routeSecurity =
      routes.reduce((sum, route) => sum + route.securityScore, 0) /
      Math.max(1, routes.length);

    return {
      securityScore: Math.round(
        connectorSecurity * 0.45 + routeSecurity * 0.55,
      ),
      quarantineConnectors: connectors
        .filter(
          (connector) =>
            connector.trustScore < 60 ||
            connector.status === 'suspended',
        )
        .map((connector) => connector.id),
      restrictedRoutes: routes
        .filter((route) => route.securityScore < 65)
        .map((route) => route.id),
    };
  }
}