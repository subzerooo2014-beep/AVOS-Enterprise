import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from "@nestjs/common";
import { KnowledgeFabricProductionCertificationService } from "./certification/knowledge-fabric-production-certification.service";
import { KnowledgeFabricProductionSmokeService } from "./certification/knowledge-fabric-production-smoke.service";
import { KnowledgeFabricProductionVerificationService } from "./certification/knowledge-fabric-production-verification.service";
import { KnowledgeFabricQuery } from "./contracts/knowledge-fabric-production.contracts";
import { KnowledgeFabricHealthService } from "./health/knowledge-fabric-health.service";
import { KnowledgeFabricMetricsService } from "./monitoring/knowledge-fabric-metrics.service";
import { KnowledgeFabricOrchestratorService } from "./orchestrator/knowledge-fabric-orchestrator.service";
import { UnifiedKnowledgeRegistryService } from "./registry/unified-knowledge-registry.service";
import { KnowledgeFabricRuntimeService } from "./runtime/knowledge-fabric-runtime.service";

@Controller("avos/knowledge-fabric/production")
export class KnowledgeFabricProductionController {
  constructor(
    private readonly runtime: KnowledgeFabricRuntimeService,
    private readonly orchestrator: KnowledgeFabricOrchestratorService,
    private readonly registry: UnifiedKnowledgeRegistryService,
    private readonly metrics: KnowledgeFabricMetricsService,
    private readonly health: KnowledgeFabricHealthService,
    private readonly verification: KnowledgeFabricProductionVerificationService,
    private readonly smoke: KnowledgeFabricProductionSmokeService,
    private readonly certification: KnowledgeFabricProductionCertificationService,
  ) {}

  @Post("runtime/start")
  start() {
    return this.runtime.start();
  }

  @Post("runtime/stop")
  stop() {
    return this.runtime.stop();
  }

  @Get("runtime/status")
  status() {
    return this.runtime.snapshot();
  }

  @Get("health")
  getHealth() {
    return this.health.health();
  }

  @Get("metrics")
  getMetrics() {
    return this.metrics.snapshot();
  }

  @Get("registry")
  getRegistry() {
    return {
      total: this.registry.count(),
      health: this.registry.health(),
      entries: this.registry.list(),
    };
  }

  @Post("search")
  @HttpCode(HttpStatus.OK)
  search(@Body() query: KnowledgeFabricQuery) {
    return this.orchestrator.search(query);
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