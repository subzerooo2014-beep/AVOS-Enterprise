import { Injectable } from "@nestjs/common";

export interface RouteDefinition {
  id: string;
  path: string;
  version: string;
  targetService: string;
  methods: string[];
  rateLimitPerMinute: number;
  requestCount: number;
  errorCount: number;
}

@Injectable()
export class UnifiedApiGatewayService {
  private readonly routes = new Map<string, RouteDefinition>();
  private readonly rateBuckets = new Map<string, {
    minute: number;
    count: number;
  }>();

  registerRoute(input: Omit<
    RouteDefinition,
    "requestCount" | "errorCount"
  >): RouteDefinition {
    const route: RouteDefinition = {
      ...input,
      requestCount: 0,
      errorCount: 0
    };

    this.routes.set(route.id, route);
    return { ...route };
  }

  route(path: string, version: string): RouteDefinition | null {
    const route = [...this.routes.values()].find(
      (item) =>
        item.path === path &&
        item.version === version
    );

    return route ? { ...route } : null;
  }

  allowRequest(clientId: string, routeId: string): boolean {
    const route = this.routes.get(routeId);
    if (!route) return false;

    const minute = Math.floor(Date.now() / 60_000);
    const key = `${clientId}:${routeId}`;
    const bucket = this.rateBuckets.get(key);

    if (!bucket || bucket.minute !== minute) {
      this.rateBuckets.set(key, { minute, count: 1 });
      route.requestCount += 1;
      return true;
    }

    if (bucket.count >= route.rateLimitPerMinute) {
      route.errorCount += 1;
      return false;
    }

    bucket.count += 1;
    route.requestCount += 1;
    return true;
  }

  transformRequest(
    payload: Record<string, unknown>,
    context: Record<string, unknown>
  ): Record<string, unknown> {
    return {
      payload,
      gatewayContext: {
        ...context,
        transformedAt: new Date().toISOString()
      }
    };
  }

  analytics(): Record<string, unknown> {
    const routes = [...this.routes.values()];
    const requests = routes.reduce(
      (total, route) => total + route.requestCount,
      0
    );
    const errors = routes.reduce(
      (total, route) => total + route.errorCount,
      0
    );

    return {
      routes: routes.length,
      requests,
      errors,
      errorRate: requests === 0 ? 0 : errors / requests,
      versions: [...new Set(routes.map((route) => route.version))]
    };
  }

  status(): Record<string, unknown> {
    return {
      name: "Unified API Gateway",
      status: "operational",
      routing: "intelligent",
      versioning: true,
      rateLimiting: true,
      requestTransformation: true,
      analytics: this.analytics()
    };
  }
}