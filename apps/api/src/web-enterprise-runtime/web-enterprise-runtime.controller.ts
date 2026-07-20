import { Controller, Get } from "@nestjs/common";
import { WebEnterpriseRuntimeService } from "./web-enterprise-runtime.service";

@Controller("avos/web-runtime")
export class WebEnterpriseRuntimeController {
  constructor(
    private readonly runtime: WebEnterpriseRuntimeService,
  ) {}

  @Get("status")
  status() {
    return this.runtime.status();
  }

  @Get("applications")
  applications() {
    return this.runtime.listApplications();
  }

  @Get("tenants")
  tenants() {
    return this.runtime.tenants();
  }

  @Get("workspaces")
  workspaces() {
    return this.runtime.workspaces();
  }

  @Get("notifications")
  notifications() {
    return this.runtime.notifications();
  }

  @Get("feature-flags")
  featureFlags() {
    return this.runtime.featureFlags();
  }

  @Get("health")
  health() {
    return this.runtime.health();
  }

  @Get("certification")
  certification() {
    return this.runtime.certification();
  }
}
