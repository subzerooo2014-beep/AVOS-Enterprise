import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { UrpAdapterCatalogService } from "./urp-adapter-catalog.service";
import { UrpDistributedRegistryService } from "./urp-distributed-registry.service";
import { UrpEndpointDiscoveryService } from "./urp-endpoint-discovery.service";
import { UrpEventBridgeService } from "./urp-event-bridge.service";
import { UrpProductionAuditService } from "./urp-production-audit.service";
import { UrpProductionCertificationService } from "./urp-production-certification.service";
import { UrpProductionDispatchService } from "./urp-production-dispatch.service";
import { UrpProductionObservabilityService } from "./urp-production-observability.service";
import { UrpProductionReadinessService } from "./urp-production-readiness.service";
import { UrpProductionVerificationService } from "./urp-production-verification.service";
import { UrpResilienceService } from "./urp-resilience.service";

@Controller("avos/runtime/production")
export class UrpProductionController {
  constructor(
    private readonly catalog: UrpAdapterCatalogService,
    private readonly discovery: UrpEndpointDiscoveryService,
    private readonly readiness: UrpProductionReadinessService,
    private readonly resilience: UrpResilienceService,
    private readonly dispatch: UrpProductionDispatchService,
    private readonly bridge: UrpEventBridgeService,
    private readonly registry: UrpDistributedRegistryService,
    private readonly audit: UrpProductionAuditService,
    private readonly observability: UrpProductionObservabilityService,
    private readonly verification: UrpProductionVerificationService,
    private readonly certification: UrpProductionCertificationService,
  ) {}

  @Get("status")
  async status() {
    return {
      name: "AVOS Unified Runtime Production Integration",
      version: "URP-1.1.0",
      status: "operational",
      adapters: this.catalog.list().length,
      circuits: this.resilience.list(),
      distributedRegistry: await this.registry.status(),
      humanFinalAuthority: true,
      globalComplianceReadinessGate: true,
    };
  }

  @Get("adapters")
  adapters() {
    return this.catalog.list();
  }

  @Post("discovery/run")
  discover() {
    return this.discovery.discoverAll();
  }

  @Get("discovery")
  discovered() {
    return this.discovery.cached();
  }

  @Get("readiness")
  productionReadiness() {
    return this.readiness.evaluate();
  }

  @Post("dispatch/command/:unitKey")
  command(
    @Param("unitKey") unitKey: string,
    @Body()
    input: {
      name: string;
      payload?: unknown;
      requestedBy?: string;
      correlationId?: string;
      timeoutMs?: number;
      retries?: number;
    },
  ) {
    return this.dispatch.dispatch({
      unitKey,
      operation: "command",
      name: input.name,
      payload: input.payload,
      requestedBy: input.requestedBy ?? "human:khalifa",
      correlationId: input.correlationId,
      timeoutMs: input.timeoutMs,
      retries: input.retries,
    });
  }

  @Post("dispatch/query/:unitKey")
  query(
    @Param("unitKey") unitKey: string,
    @Body()
    input: {
      name: string;
      payload?: unknown;
      requestedBy?: string;
      correlationId?: string;
      timeoutMs?: number;
      retries?: number;
    },
  ) {
    return this.dispatch.dispatch({
      unitKey,
      operation: "query",
      name: input.name,
      payload: input.payload,
      requestedBy: input.requestedBy ?? "human:khalifa",
      correlationId: input.correlationId,
      timeoutMs: input.timeoutMs,
      retries: input.retries,
    });
  }

  @Post("events/bridge")
  bridgeEvent(
    @Body()
    input: {
      topic: string;
      type: string;
      source: string;
      target?: string;
      payload?: unknown;
      correlationId?: string;
    },
  ) {
    return this.bridge.bridge({
      topic: input.topic,
      type: input.type,
      source: input.source,
      target: input.target,
      payload: input.payload ?? {},
      correlationId: input.correlationId,
    });
  }

  @Get("events")
  events(@Query("limit") limit?: string) {
    return this.bridge.list(limit ? Number(limit) : 100);
  }

  @Get("circuits")
  circuits() {
    return this.resilience.list();
  }

  @Post("registry/heartbeat")
  heartbeat() {
    return this.registry.heartbeat();
  }

  @Get("registry")
  distributedRegistry() {
    return this.registry.status();
  }

  @Get("audit")
  recentAudit(@Query("limit") limit?: string) {
    return this.audit.recent(limit ? Number(limit) : 100);
  }

  @Get("observability")
  observation() {
    return this.observability.snapshot();
  }

  @Post("verification/run")
  verify() {
    return this.verification.run();
  }

  @Post("certification/certify")
  certify(@Body() input: { approvedBy?: string }) {
    return this.certification.certify(
      input?.approvedBy ?? "human:khalifa",
    );
  }

  @Get("certification/status")
  certificationStatus() {
    return this.certification.status();
  }
}