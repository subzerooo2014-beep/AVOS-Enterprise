import {
  Body,
  Controller,
  Get,
  Post,
  Query
} from "@nestjs/common";
import { CapabilityBlueprintRegistryService } from "./capability-blueprint-registry.service";
import { CapabilityProductionOrchestratorService } from "./capability-production-orchestrator.service";
import { CapabilityProductionCertificationService } from "./capability-production-certification.service";
import { CapabilityReleasePackagerService } from "./capability-release-packager.service";
import { CapabilityProductionSmokeService } from "./capability-production-smoke.service";
import { CapabilityBlueprint } from "./capability-production.contracts";

@Controller("avos/factory/v1/capability-production")
export class CapabilityProductionController {
  constructor(
    private readonly blueprints: CapabilityBlueprintRegistryService,
    private readonly orchestrator: CapabilityProductionOrchestratorService,
    private readonly certificates: CapabilityProductionCertificationService,
    private readonly packages: CapabilityReleasePackagerService,
    private readonly smoke: CapabilityProductionSmokeService
  ) {}

  @Post("run")
  run(
    @Body()
    body: {
      blueprint: Omit<CapabilityBlueprint, "id" | "createdAt">;
      approvedBy: string;
    }
  ) {
    return this.orchestrator.run(
      body.blueprint,
      body.approvedBy
    );
  }

  @Post("smoke/run")
  smokeRun() {
    return this.smoke.run();
  }

  @Get("blueprints")
  blueprintList(@Query("limit") limit?: string) {
    return {
      items: this.blueprints.list(limit ? Number(limit) : 100)
    };
  }

  @Get("runs")
  runList(@Query("limit") limit?: string) {
    return {
      items: this.orchestrator.list(limit ? Number(limit) : 100)
    };
  }

  @Get("certificates")
  certificateList(@Query("limit") limit?: string) {
    return {
      items: this.certificates.list(limit ? Number(limit) : 100)
    };
  }

  @Get("packages")
  packageList(@Query("limit") limit?: string) {
    return {
      items: this.packages.list(limit ? Number(limit) : 100)
    };
  }

  @Get("health")
  health() {
    const latestRun = this.orchestrator.list(1)[0] ?? null;
    const healthy = latestRun?.status === "packaged";

    return {
      score: healthy ? 100 : 0,
      level: healthy ? "excellent" : "critical",
      status: healthy ? "healthy" : "not-ready",
      humanFinalAuthority: true,
      latestRun
    };
  }
}
