import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { PlatformCertificationService } from "./certification/platform-certification.service";
import { UnifiedPlatformControllerService } from "./controller/unified-platform-controller.service";
import { SharedServiceDiscoveryService } from "./discovery/shared-service-discovery.service";
import { UnifiedEventBusService } from "./events/unified-event-bus.service";
import { UnifiedApiGatewayService } from "./gateway/unified-api-gateway.service";
import { CrossSuiteIntelligenceService } from "./intelligence/cross-suite-intelligence.service";
import { PlatformObservabilityService } from "./observability/platform-observability.service";
import { CrossSuiteOrchestratorService } from "./orchestrator/cross-suite-orchestrator.service";
import { UnifiedPlatformRegistryService } from "./registry/unified-platform-registry.service";
import { UnifiedPlatformReportService } from "./reporting/unified-platform-report.service";
import { PlatformSmokeTestService } from "./smoke/platform-smoke-test.service";
import { UnifiedWorkflowEngineService } from "./workflow/unified-workflow-engine.service";

@Controller("avos/unified-platform")
export class UnifiedPlatformHttpController {
  constructor(
    private readonly platform: UnifiedPlatformControllerService,
    private readonly registry: UnifiedPlatformRegistryService,
    private readonly orchestrator: CrossSuiteOrchestratorService,
    private readonly workflows: UnifiedWorkflowEngineService,
    private readonly events: UnifiedEventBusService,
    private readonly gateway: UnifiedApiGatewayService,
    private readonly intelligence: CrossSuiteIntelligenceService,
    private readonly discovery: SharedServiceDiscoveryService,
    private readonly observability: PlatformObservabilityService,
    private readonly certification: PlatformCertificationService,
    private readonly smoke: PlatformSmokeTestService,
    private readonly report: UnifiedPlatformReportService
  ) {}

  @Post("boot") boot() { return this.platform.boot(); }
  @Post("shutdown") shutdown() { return this.platform.shutdown(); }
  @Post("restart") restart() { return this.platform.restart(); }
  @Get("status") status() { return this.platform.status(); }
  @Get("coordinate") coordinate() { return this.platform.coordinate(); }

  @Get("registry") registryList(@Query("type") type?: any) { return this.registry.list(type); }
  @Get("registry/:id") registryGet(@Param("id") id: string) { return this.registry.get(id); }

  @Post("orchestrate")
  orchestrate(@Body() body: { objective?: string; requiresHumanApproval?: boolean }) {
    return this.orchestrator.orchestrate(body.objective ?? "Unified cross-suite objective", body.requiresHumanApproval ?? true);
  }

  @Get("workflows") workflowRuns() { return this.workflows.listRuns(); }
  @Get("events") eventHistory(@Query("limit") limit?: string) { return this.events.list(Number(limit ?? 100)); }

  @Post("gateway/routes")
  addRoute(@Body() body: { path: string; target: string; version?: string; requiredRole?: string }) {
    return this.gateway.registerRoute(body.path, body.target, body.version, body.requiredRole);
  }

  @Post("gateway/route")
  route(@Body() body: { path: string; identityId: string }) {
    return this.gateway.route(body.path, body.identityId);
  }

  @Post("intelligence/analyze")
  analyze(@Body() body: { objective?: string }) {
    return this.intelligence.analyze(body.objective ?? "Unified platform analysis");
  }

  @Get("discovery")
  discover(@Query("capability") capability?: string) {
    return this.discovery.discover(capability);
  }

  @Get("health") health() { return this.observability.health(); }
  @Get("metrics") metrics() { return this.observability.metrics(); }
  @Get("dashboard") dashboard() { return this.observability.dashboard(); }

  @Post("smoke/run") smokeRun() { return this.smoke.run(); }

  @Post("certification/certify")
  certify(@Body() body: { approvedBy?: string }) {
    return this.certification.certify(body.approvedBy ?? "human:pending");
  }

  @Get("certification/status") certificationStatus() { return this.certification.status(); }
  @Get("report") platformReport() { return this.report.generate(); }
}