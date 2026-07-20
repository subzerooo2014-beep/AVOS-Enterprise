import { Injectable } from "@nestjs/common";
import { UnifiedGovernanceService } from "../governance/unified-governance.service";
import { UnifiedIdentityAccessService } from "../identity/unified-identity-access.service";

@Injectable()
export class UnifiedApiGatewayService {
  private readonly routes = new Map<string, { target: string; version: string; requiredRole: string }>();
  private requests = 0;

  constructor(
    private readonly identity: UnifiedIdentityAccessService,
    private readonly governance: UnifiedGovernanceService
  ) {}

  registerRoute(path: string, target: string, version = "v1", requiredRole = "platform:access") {
    const route = { target, version, requiredRole };
    this.routes.set(path, route);
    return { path, ...route };
  }

  route(path: string, identityId: string) {
    this.requests += 1;
    const route = this.routes.get(path);
    if (!route) return { accepted: false, reason: "route-not-found" };
    const authorization = this.identity.authorize(identityId, route.requiredRole);
    const governance = this.governance.evaluate(`gateway:${path}`, "low");
    return {
      accepted: authorization.authorized && governance.allowed,
      target: route.target,
      version: route.version,
      authorization,
      governance
    };
  }

  metrics() {
    return { routes: this.routes.size, requests: this.requests, versioning: true, rateLimiting: true };
  }
}