import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { EnterpriseRuntimePlatformV1Service } from "./enterprise-runtime-platform-v1.service";
import { RuntimeDependencyResolverV1Service } from "./runtime-dependency-resolver-v1.service";
import { RuntimeDiagnosticsV1Service } from "./runtime-diagnostics-v1.service";
import { RuntimeFailoverManagerV1Service } from "./runtime-failover-manager-v1.service";
import { RuntimeHealthOrchestratorV1Service } from "./runtime-health-orchestrator-v1.service";
import { RuntimeLifecycleManagerV1Service } from "./runtime-lifecycle-manager-v1.service";
import { RuntimeRecoveryCoordinatorV1Service } from "./runtime-recovery-coordinator-v1.service";
import { RuntimeServiceRegistryV1Service } from "./runtime-service-registry-v1.service";
import type {
  RuntimeRecoveryPlanV1,
  RuntimeServiceRecordV1,
} from "./enterprise-runtime-platform-v1.types";

@Controller("enterprise-runtime-platform-v1")
export class EnterpriseRuntimePlatformV1Controller {
  constructor(
    private readonly platform: EnterpriseRuntimePlatformV1Service,
    private readonly services: RuntimeServiceRegistryV1Service,
    private readonly lifecycle: RuntimeLifecycleManagerV1Service,
    private readonly dependencies: RuntimeDependencyResolverV1Service,
    private readonly health: RuntimeHealthOrchestratorV1Service,
    private readonly recovery: RuntimeRecoveryCoordinatorV1Service,
    private readonly failover: RuntimeFailoverManagerV1Service,
    private readonly diagnosticsService: RuntimeDiagnosticsV1Service,
  ) {}

  @Get("status")
  status() {
    return this.platform.status();
  }

  @Get("diagnostics")
  diagnostics() {
    return this.platform.diagnostics();
  }

  @Post("services")
  upsertService(
    @Body()
    body: Omit<RuntimeServiceRecordV1, "createdAt" | "updatedAt">,
  ) {
    return {
      success: true,
      service: this.services.upsert(body),
    };
  }

  @Post("services/:id/start")
  startService(@Param("id") id: string) {
    return {
      success: true,
      events: [
        this.lifecycle.transition(id, "STARTING", "Runtime start requested."),
        this.lifecycle.transition(id, "READY", "Runtime start completed."),
      ],
    };
  }

  @Post("services/:id/shutdown")
  shutdownService(@Param("id") id: string) {
    return {
      success: true,
      events: this.lifecycle.gracefulShutdown(id),
    };
  }

  @Get("dependencies/:serviceId")
  resolveDependencies(@Param("serviceId") serviceId: string) {
    return {
      success: true,
      result: this.dependencies.resolve(serviceId),
    };
  }

  @Post("services/:id/health")
  evaluateHealth(
    @Param("id") id: string,
    @Body() body: { checks: Record<string, boolean> },
  ) {
    return {
      success: true,
      health: this.health.evaluate(id, body.checks),
    };
  }

  @Post("recovery")
  createRecovery(
    @Body()
    body: {
      serviceId: string;
      strategy: RuntimeRecoveryPlanV1["strategy"];
    },
  ) {
    return {
      success: true,
      plan: this.recovery.create(body.serviceId, body.strategy),
    };
  }

  @Post("recovery/:id/execute")
  executeRecovery(@Param("id") id: string) {
    return {
      success: true,
      plan: this.recovery.execute(id),
    };
  }

  @Post("failover")
  executeFailover(
    @Body()
    body: {
      serviceId: string;
      fromNode: string;
      toNode: string;
    },
  ) {
    return {
      success: true,
      failover: this.failover.execute(
        body.serviceId,
        body.fromNode,
        body.toNode,
      ),
    };
  }

  @Post("verify")
  verifyRuntime() {
    return {
      success: true,
      diagnostic: this.diagnosticsService.run(),
    };
  }
}
