import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { CapabilityRegistryService } from "../capability-fabric/capability-registry.service";
import { CapabilityRuntimeService } from "./capability-runtime.service";
import {
  CapabilityRuntimeExecutionRequest,
  CapabilityRuntimeLoadRequest,
} from "./capability-runtime.types";

@Controller("capability-fabric/runtime")
export class CapabilityRuntimeController {
  constructor(
    private readonly runtime: CapabilityRuntimeService,
    private readonly registry: CapabilityRegistryService,
  ) {}

  @Get("status")
  status() {
    return this.runtime.framework();
  }

  @Post("instances")
  load(@Body() body: CapabilityRuntimeLoadRequest) {
    return this.runtime.load(body);
  }

  @Get("instances")
  list(
    @Query("capabilityKey") capabilityKey?: string,
    @Query("tenantId") tenantId?: string,
    @Query("state") state?: string,
  ) {
    return {
      success: true,
      instances: this.runtime.list({
        capabilityKey,
        tenantId,
        state,
      }),
    };
  }

  @Get("instances/:runtimeId")
  get(@Param("runtimeId") runtimeId: string) {
    return {
      success: true,
      instance: this.runtime.get(runtimeId),
    };
  }

  @Post("instances/:runtimeId/activate")
  activate(@Param("runtimeId") runtimeId: string) {
    return this.runtime.activate(runtimeId);
  }

  @Post("instances/:runtimeId/suspend")
  suspend(
    @Param("runtimeId") runtimeId: string,
    @Body() body: { reason?: string },
  ) {
    return this.runtime.suspend(runtimeId, body.reason);
  }

  @Post("instances/:runtimeId/restart")
  restart(@Param("runtimeId") runtimeId: string) {
    return this.runtime.restart(runtimeId);
  }

  @Post("instances/:runtimeId/stop")
  stop(
    @Param("runtimeId") runtimeId: string,
    @Body() body: { reason?: string },
  ) {
    return this.runtime.stop(runtimeId, body.reason);
  }

  @Get("instances/:runtimeId/health")
  health(@Param("runtimeId") runtimeId: string) {
    return this.runtime.checkHealth(runtimeId);
  }

  @Get("instances/:runtimeId/diagnostics")
  diagnostics(@Param("runtimeId") runtimeId: string) {
    return {
      success: true,
      diagnostics: this.runtime.diagnostics(runtimeId),
    };
  }

  @Post("execute")
  execute(@Body() body: CapabilityRuntimeExecutionRequest) {
    return this.runtime.execute(body);
  }

  @Post("instances/:runtimeId/cache/:key")
  cacheSet(
    @Param("runtimeId") runtimeId: string,
    @Param("key") key: string,
    @Body() body: { value: unknown; ttlMs?: number },
  ) {
    return this.runtime.cacheSet(runtimeId, key, body.value, body.ttlMs);
  }

  @Get("instances/:runtimeId/cache/:key")
  cacheGet(
    @Param("runtimeId") runtimeId: string,
    @Param("key") key: string,
  ) {
    return {
      success: true,
      value: this.runtime.cacheGet(runtimeId, key),
    };
  }

  @Get("snapshot")
  snapshot() {
    return {
      success: true,
      snapshot: this.runtime.snapshot(),
    };
  }

  @Post("smoke")
  async smoke() {
    const key = "avos.capability-runtime.smoke";

    if (!this.registry.get(key)) {
      const registration = this.registry.register({
        key,
        name: "Capability Runtime Smoke Capability",
        kind: "PLATFORM_SERVICE",
        owner: "AVOS Capability Fabric",
        summary: "Runtime validation capability for CF-2.",
        businessValue: "Validates capability loading and execution.",
        lifecycleStage: "CORE_ENGINE",
        metrics: [
          {
            name: "runtime_smoke_executions",
            unit: "count",
            type: "COUNTER",
          },
        ],
        health: {
          healthEndpoint: "/capability-fabric/runtime/status",
        },
        runtime: {
          runtime: "NODE",
          stateless: true,
          multiTenant: true,
          supportsIsolation: true,
        },
        security: {
          classification: "INTERNAL",
          authenticationRequired: true,
          authorizationRequired: true,
          dataSensitivity: [],
          trustBoundary: "AVOS_ENTERPRISE_PLATFORM",
        },
      });

      if (!registration.success) {
        return registration;
      }
    }

    const loaded = this.runtime.load({
      capabilityKey: key,
      tenantId: "smoke",
      environment: "verification",
      lazy: true,
      isolation: "ISOLATED_CONTEXT",
    });

    if (!loaded.success || !loaded.instance) {
      return loaded;
    }

    const execution = await this.runtime.execute({
      runtimeId: loaded.instance.runtimeId,
      operation: "runtime-smoke",
      payload: { stage: "CF-2" },
    });

    const suspended = this.runtime.suspend(
      loaded.instance.runtimeId,
      "CF-2 smoke suspension",
    );
    const restarted = this.runtime.restart(loaded.instance.runtimeId);
    const health = this.runtime.checkHealth(loaded.instance.runtimeId);

    return {
      success:
        execution.success &&
        suspended.success &&
        restarted.success &&
        health.health.status === "HEALTHY",
      system: "AVOS Capability Fabric",
      megaPack: "CF-2 Capability Runtime",
      lazyLoading: true,
      activatedOnExecution: execution.success,
      isolation: loaded.instance.isolation,
      suspension: suspended.success,
      restart: restarted.success,
      runtimeHealth: health.health.status,
      pillars: this.runtime.framework().pillars.length,
      snapshot: this.runtime.snapshot(),
    };
  }
}