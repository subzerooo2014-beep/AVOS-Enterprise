import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { EnterpriseCacheService } from "./enterprise-cache.service";
import { EnterpriseCircuitBreakerService } from "./enterprise-circuit-breaker.service";
import { EnterpriseCommandBusService } from "./enterprise-command-bus.service";
import { EnterpriseE5OrchestratorService } from "./enterprise-e5-orchestrator.service";
import { EnterpriseEventMeshService } from "./enterprise-event-mesh.service";
import { EnterpriseRateLimiterService } from "./enterprise-rate-limiter.service";
import { EnterpriseRuntimeAnalyticsService } from "./enterprise-runtime-analytics.service";
import { EnterpriseSchedulerService } from "./enterprise-scheduler.service";
import { EnterpriseServiceDiscoveryService } from "./enterprise-service-discovery.service";

@Controller("enterprise-e5")
export class EnterpriseE5Controller {
  constructor(
    private readonly orchestrator: EnterpriseE5OrchestratorService,
    private readonly events: EnterpriseEventMeshService,
    private readonly commands: EnterpriseCommandBusService,
    private readonly scheduler: EnterpriseSchedulerService,
    private readonly circuit: EnterpriseCircuitBreakerService,
    private readonly limiter: EnterpriseRateLimiterService,
    private readonly cache: EnterpriseCacheService,
    private readonly discovery: EnterpriseServiceDiscoveryService,
    private readonly analytics: EnterpriseRuntimeAnalyticsService,
  ) {}

  @Get("status")
  status() {
    return this.orchestrator.status();
  }

  @Post("bootstrap")
  bootstrap() {
    return this.orchestrator.bootstrap();
  }

  @Post("execute")
  execute(@Body() body: { name?: string }) {
    return this.orchestrator.execute(body?.name);
  }

  @Get("events")
  listEvents() {
    return this.events.list();
  }

  @Get("commands")
  listCommands() {
    return this.commands.list();
  }

  @Post("jobs")
  registerJob(
    @Body()
    body: {
      name?: string;
      schedule?: string;
      enabled?: boolean;
    },
  ) {
    return this.scheduler.register(
      body?.name || "enterprise-background-job",
      body?.schedule || "manual",
      body?.enabled ?? true,
    );
  }

  @Post("jobs/:id/run")
  runJob(@Param("id") id: string) {
    return this.scheduler.run(id);
  }

  @Get("jobs")
  listJobs() {
    return this.scheduler.list();
  }

  @Post("circuit/failure")
  recordCircuitFailure() {
    return this.circuit.recordFailure();
  }

  @Post("circuit/success")
  recordCircuitSuccess() {
    return this.circuit.recordSuccess();
  }

  @Post("rate-limit")
  rateLimit(
    @Body()
    body: {
      key?: string;
      limit?: number;
      windowMs?: number;
    },
  ) {
    return this.limiter.allow(
      body?.key || "enterprise-e5",
      body?.limit || 100,
      body?.windowMs || 60_000,
    );
  }

  @Post("cache/set")
  cacheSet(
    @Body()
    body: {
      key?: string;
      value?: unknown;
      ttlMs?: number;
    },
  ) {
    return this.cache.set(
      body?.key || "enterprise-e5",
      body?.value ?? true,
      body?.ttlMs,
    );
  }

  @Get("cache/:key")
  cacheGet(@Param("key") key: string) {
    return this.cache.get(key);
  }

  @Post("services")
  registerService(
    @Body()
    body: {
      name?: string;
      endpoint?: string;
      healthy?: boolean;
    },
  ) {
    return this.discovery.register(
      body?.name || "enterprise-service",
      body?.endpoint || "http://localhost:3000",
      body?.healthy ?? true,
    );
  }

  @Get("services")
  listServices() {
    return this.discovery.list();
  }

  @Get("analytics")
  runtimeAnalytics() {
    return this.analytics.snapshot();
  }

  @Post("smoke")
  smoke() {
    this.orchestrator.bootstrap();
    const execution = this.orchestrator.execute("enterprise-e5-smoke");

    return {
      success: execution.success === true,
      system: "AVOS Enterprise Mega Bundle E5",
      integrationStatus: "running",
      executionStatus: execution.status,
      eventMesh: true,
      commandBus: true,
      scheduler: true,
      circuitState: execution.circuit.state,
      discoveredServices: execution.analytics?.discoveredServices ?? 0,
      healthyServices: execution.analytics?.healthyServices ?? 0,
      capabilities: 12,
    };
  }
}