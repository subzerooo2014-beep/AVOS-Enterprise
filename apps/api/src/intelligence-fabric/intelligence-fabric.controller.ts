import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from "@nestjs/common";
import { IntelligenceRequest } from "./contracts/intelligence-fabric.contracts";
import { IntelligenceMetricsService } from "./monitoring/intelligence-metrics.service";
import { IntelligenceOrchestratorService } from "./orchestrator/intelligence-orchestrator.service";
import { IntelligenceRuntimeService } from "./runtime/intelligence-runtime.service";
import { IntelligenceSignalRegistryService } from "./signals/intelligence-signal-registry.service";
import { IntelligenceFoundationCertificationService } from "./verification/intelligence-foundation-certification.service";
import { IntelligenceFoundationSmokeService } from "./verification/intelligence-foundation-smoke.service";
import { IntelligenceFoundationVerificationService } from "./verification/intelligence-foundation-verification.service";

@Controller("avos/intelligence-fabric")
export class IntelligenceFabricController {
  constructor(
    private readonly runtime: IntelligenceRuntimeService,
    private readonly signals: IntelligenceSignalRegistryService,
    private readonly orchestrator: IntelligenceOrchestratorService,
    private readonly metrics: IntelligenceMetricsService,
    private readonly verification: IntelligenceFoundationVerificationService,
    private readonly smoke: IntelligenceFoundationSmokeService,
    private readonly certification: IntelligenceFoundationCertificationService,
  ) {}

  @Get("runtime/status")
  status() {
    return this.runtime.snapshot();
  }

  @Get("signals")
  getSignals() {
    return {
      total: this.signals.count(),
      entries: this.signals.list(),
    };
  }

  @Get("metrics")
  getMetrics() {
    return this.metrics.snapshot();
  }

  @Post("analyze")
  @HttpCode(HttpStatus.OK)
  analyze(@Body() request: IntelligenceRequest) {
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