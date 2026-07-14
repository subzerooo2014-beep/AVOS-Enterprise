import { Injectable } from '@nestjs/common';
import { ApiGatewayRoute } from './enterprise-integration-federation.types';

@Injectable()
export class EnterpriseApiGatewayIntelligenceService {
  analyze(routes: ApiGatewayRoute[]) {
    const evaluated = routes
      .map((route) => {
        const health =
          route.securityScore * 0.4 +
          Math.max(0, 100 - route.errorRate) * 0.35 +
          Math.max(0, 100 - route.latencyMs / 10) * 0.25;

        return {
          ...route,
          health: Math.round(Math.max(0, Math.min(100, health))),
        };
      })
      .sort((left, right) => right.health - left.health);

    return {
      routes: evaluated,
      healthyRoutes: evaluated
        .filter((route) => route.health >= 70)
        .map((route) => route.id),
      unhealthyRoutes: evaluated
        .filter((route) => route.health < 70)
        .map((route) => route.id),
      gatewayHealth: Math.round(
        evaluated.reduce((sum, route) => sum + route.health, 0) /
          Math.max(1, evaluated.length),
      ),
    };
  }
}