import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import {
  IntelligenceEngineHealth,
  UnifiedIntelligenceRequest,
} from "./contracts/unified-intelligence-orchestration.contracts";
import { IntelligenceOrchestrationEventBusService } from "./events/intelligence-orchestration-event-bus.service";
import { UnifiedIntelligenceHealthService } from "./health/unified-intelligence-health.service";
import { UnifiedIntelligenceObservabilityService } from "./monitoring/unified-intelligence-observability.service";
import { UnifiedIntelligenceOrchestratorService } from "./orchestrator/unified-intelligence-orchestrator.service";
import { UnifiedIntelligenceEngineRegistryService } from "./registry/unified-intelligence-engine-registry.service";
import { IntelligenceOrchestrationCertificationService } from "./verification/intelligence-orchestration-certification.service";
import { IntelligenceOrchestrationSmokeService } from "./verification/intelligence-orchestration-smoke.service";
import { IntelligenceOrchestrationVerificationService } from "./verification/intelligence-orchestration-verification.service";

@Controller("avos/intelligence-fabric/orchestration")
export class IntelligenceFabricOrchestrationController {
  constructor(
    private readonly registry: UnifiedIntelligenceEngineRegistryService,
    private readonly orchestrator: UnifiedIntelligenceOrchestratorService,
    private readonly observability: UnifiedIntelligenceObservabilityService,
    private readonly health: UnifiedIntelligenceHealthService,
    private readonly events: IntelligenceOrchestrationEventBusService,
    private readonly verification: IntelligenceOrchestrationVerificationService,
    private readonly smoke: IntelligenceOrchestrationSmokeService,
    private readonly certification: IntelligenceOrchestrationCertificationService,
  ) {}

  @Get("registry")
  getRegistry() {
    return {
      health: this.registry.health(),
      engines: this.registry.list(),
    };
  }

  @Patch("registry/:id/health")
  updateHealth(
    @Param("id") id: string,
    @Body() body: { health: IntelligenceEngineHealth },
  ) {
    return {
      engine: this.registry.updateHealth(id, body.health) ?? null,
    };
  }

  @Get("health")
  getHealth() {
    return this.health.snapshot();
  }

  @Get("metrics")
  getMetrics() {
    return this.observability.snapshot();
  }

  @Get("events")
  getEvents(@Query("limit") limit?: string) {
    const parsed = Number(limit ?? 50);

    return {
      total: this.events.count(),
      entries: this.events.list(
        Number.isFinite(parsed) ? parsed : 50,
      ),
    };
  }

  @Post("execute")
  @HttpCode(HttpStatus.OK)
  execute(@Body() request: UnifiedIntelligenceRequest) {
    return this.orchestrator.execute(request);
  }

  @Post("verification/run")
  @HttpCode(HttpStatus.OK)
  verify() {
    return this.verification.run();
  }

  @Post("smoke/run")
  @HttpCode(HttpStatus.OK)
  runSmoke() {
    return this.smoke.run();
  }

  @Post("certification/certify")
  @HttpCode(HttpStatus.OK)
  certify() {
    return this.certification.certify();
  }

  @Get("certification/status")
  certificationStatus() {
    return {
      verification: this.verification.latest() ?? null,
      certification: this.certification.latest() ?? null,
    };
  }
}