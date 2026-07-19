import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { PlatformRuntimeRegistryService } from "./platform-runtime-registry.service";
import { PlatformRuntimeContextService } from "./platform-runtime-context.service";
import { PlatformRuntimeConfigurationService } from "./platform-runtime-configuration.service";
import { PlatformRuntimeSessionService } from "./platform-runtime-session.service";
import { UnifiedPlatformRuntimeService } from "./unified-platform-runtime.service";
import { PlatformProductionMegaPack1StatusService } from "./platform-production-mega-pack-1-status.service";
import { PlatformProductionMegaPack1AssuranceService } from "./platform-production-mega-pack-1-assurance.service";

@Controller("avos/platform/production/mega-pack-1")
export class PlatformProductionMegaPack1Controller {
  constructor(
    private readonly registry: PlatformRuntimeRegistryService,
    private readonly contexts: PlatformRuntimeContextService,
    private readonly configurations: PlatformRuntimeConfigurationService,
    private readonly sessions: PlatformRuntimeSessionService,
    private readonly runtime: UnifiedPlatformRuntimeService,
    private readonly statusService: PlatformProductionMegaPack1StatusService,
    private readonly assurance: PlatformProductionMegaPack1AssuranceService,
  ) {}

  @Get("status")
  status() {
    return this.statusService.status();
  }

  @Get("runtime/registry")
  runtimeRegistry() {
    return this.registry.list();
  }

  @Get("runtime/contexts")
  runtimeContexts() {
    return this.contexts.list();
  }

  @Get("runtime/configurations")
  runtimeConfigurations() {
    return this.configurations.list();
  }

  @Get("runtime/sessions")
  runtimeSessions() {
    return this.sessions.list();
  }

  @Get("runtime/metrics")
  runtimeMetrics(@Query("runtimeId") runtimeId?: string) {
    return this.runtime.listMetrics(runtimeId);
  }

  @Get("runtime/commands")
  runtimeCommands() {
    return this.runtime.listCommands();
  }

  @Post("runtime/execute")
  execute(
    @Body()
    body: {
      command:
        | "bootstrap"
        | "start"
        | "stop"
        | "restart"
        | "discover"
        | "health-check"
        | "synchronize";
      requestedBy: string;
      runtimeIds?: string[];
      approvedBy?: string;
    },
  ) {
    return this.runtime.execute(
      body.command,
      body.requestedBy,
      body.runtimeIds,
      body.approvedBy,
    );
  }

  @Post("runtime/health/run")
  health() {
    return this.runtime.health();
  }

  @Get("runtime/health/status")
  healthStatus() {
    return this.runtime.latestHealth();
  }

  @Post("verification/run")
  verification() {
    return this.assurance.verification();
  }

  @Post("smoke/run")
  smoke() {
    return this.assurance.smoke();
  }

  @Post("certification/certify")
  certify(@Body() body: { approvedBy: string }) {
    return this.assurance.certify(body.approvedBy);
  }

  @Get("certification/status")
  certificationStatus() {
    return this.assurance.certificationStatus();
  }
}