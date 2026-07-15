import { Body, Controller, Get, Post } from "@nestjs/common";
import { GlobalEnterpriseServicesService } from "./global-enterprise-services.service";
import {
  GlobalAccessContext,
  GlobalIdentityProvider,
  GlobalOrganizationNode,
  GlobalPolicy,
} from "./global-enterprise-services.types";

@Controller("global-platform/enterprise")
export class GlobalEnterpriseServicesController {
  constructor(
    private readonly enterprise: GlobalEnterpriseServicesService,
  ) {}

  @Get("dashboard")
  dashboard() {
    return this.enterprise.getExecutiveSnapshot();
  }

  @Get("identity-providers")
  identityProviders() {
    return this.enterprise.listIdentityProviders();
  }

  @Post("identity-providers")
  registerIdentityProvider(
    @Body()
    input: Omit<GlobalIdentityProvider, "id" | "createdAt" | "updatedAt">,
  ) {
    return this.enterprise.registerIdentityProvider(input);
  }

  @Get("organizations")
  organizations() {
    return this.enterprise.listOrganizationNodes();
  }

  @Post("organizations")
  createOrganizationNode(
    @Body()
    input: Omit<GlobalOrganizationNode, "id" | "createdAt" | "updatedAt">,
  ) {
    return this.enterprise.createOrganizationNode(input);
  }

  @Get("policies")
  policies() {
    return this.enterprise.listPolicies();
  }

  @Post("policies")
  registerPolicy(@Body() input: Omit<GlobalPolicy, "id">) {
    return this.enterprise.registerPolicy(input);
  }

  @Post("access/evaluate")
  evaluateAccess(@Body() context: GlobalAccessContext) {
    return this.enterprise.evaluateAccess(context);
  }

  @Get("events")
  events() {
    return this.enterprise.listEvents();
  }

  @Post("events")
  publishEvent(
    @Body() body: { eventType: string; payload: Record<string, unknown> },
  ) {
    return this.enterprise.publishEvent(body.eventType, body.payload);
  }
}