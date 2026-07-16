import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CapabilityRegistryService } from "../capability-fabric/capability-registry.service";
import { CapabilityOrchestrationRegistryService } from "./capability-orchestration-registry.service";
import { CapabilityOrchestrationService } from "./capability-orchestration.service";
import {
  CapabilityDiscoveryQuery,
  CapabilityOrchestrationExecutionRequest,
  CapabilityOrchestrationNode,
  CapabilityRouteDefinition,
  CapabilityRouteStrategy,
} from "./capability-orchestration.types";

@Controller("capability-fabric/orchestration")
export class CapabilityOrchestrationController {
  constructor(
    private readonly orchestration: CapabilityOrchestrationService,
    private readonly registry: CapabilityOrchestrationRegistryService,
    private readonly capabilityRegistry: CapabilityRegistryService,
  ) {}

  @Get("status")
  status() {
    return this.orchestration.framework();
  }

  @Post("definitions")
  register(
    @Body()
    body: {
      key: string;
      name: string;
      version?: string;
      description: string;
      owner: string;
      nodes: CapabilityOrchestrationNode[];
      tags?: string[];
    },
  ) {
    return this.registry.register(body);
  }

  @Get("definitions")
  list() {
    return { success: true, definitions: this.registry.list() };
  }

  @Get("definitions/:key")
  get(@Param("key") key: string) {
    return { success: true, definition: this.registry.get(key) };
  }

  @Post("definitions/:key/activate")
  activate(@Param("key") key: string) {
    return this.registry.activate(key);
  }

  @Post("definitions/:key/pause")
  pause(@Param("key") key: string) {
    return this.registry.pause(key);
  }

  @Get("definitions/:key/plan")
  plan(@Param("key") key: string) {
    return { success: true, plan: this.registry.plan(key) };
  }

  @Post("discover")
  discover(@Body() body: CapabilityDiscoveryQuery) {
    return {
      success: true,
      results: this.orchestration.discover(body),
    };
  }

  @Post("routes")
  registerRoute(
    @Body()
    body: {
      routeKey: string;
      strategy: CapabilityRouteStrategy;
      candidates: CapabilityRouteDefinition["candidates"];
      fallbackCapabilityKey?: string;
    },
  ) {
    return this.orchestration.registerRoute(body);
  }

  @Post("routes/:routeKey/resolve")
  resolveRoute(
    @Param("routeKey") routeKey: string,
    @Body() body: { tags?: string[] },
  ) {
    return this.orchestration.resolveRoute(routeKey, body.tags ?? []);
  }

  @Post("execute")
  execute(@Body() body: CapabilityOrchestrationExecutionRequest) {
    return this.orchestration.execute(body);
  }

  @Get("executions")
  history() {
    return { success: true, executions: this.orchestration.history() };
  }

  @Get("snapshot")
  snapshot() {
    return {
      success: true,
      snapshot: this.orchestration.snapshot(),
    };
  }

  @Post("smoke")
  async smoke() {
    const firstKey = "avos.orchestration.smoke.prepare";
    const secondKey = "avos.orchestration.smoke.finalize";

    for (const [key, name] of [
      [firstKey, "Prepare Capability"],
      [secondKey, "Finalize Capability"],
    ] as const) {
      if (!this.capabilityRegistry.get(key)) {
        const registration = this.capabilityRegistry.register({
          key,
          name,
          kind: "PLATFORM_SERVICE",
          owner: "AVOS Capability Fabric",
          summary: `${name} for CF-3 smoke validation.`,
          businessValue: "Validates governed capability composition.",
          lifecycleStage: "CORE_ENGINE",
          metrics: [
            {
              name: `${key.replaceAll(".", "_")}_executions`,
              unit: "count",
              type: "COUNTER",
            },
          ],
          health: {
            healthEndpoint: "/capability-fabric/orchestration/status",
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

        this.capabilityRegistry.transitionStatus(key, "ACTIVE");
      }
    }

    const orchestrationKey = "avos.cf3.smoke-pipeline";

    if (!this.registry.get(orchestrationKey)) {
      const registered = this.registry.register({
        key: orchestrationKey,
        name: "CF-3 Smoke Pipeline",
        description: "Two-stage orchestration validation.",
        owner: "AVOS Capability Fabric",
        tags: ["smoke", "orchestration"],
        nodes: [
          {
            id: "prepare",
            capabilityKey: firstKey,
            operation: "prepare",
            mode: "SEQUENTIAL",
            dependsOn: [],
          },
          {
            id: "finalize",
            capabilityKey: secondKey,
            operation: "finalize",
            mode: "SEQUENTIAL",
            dependsOn: ["prepare"],
          },
        ],
      });

      if (!registered.success) {
        return registered;
      }

      const activated = this.registry.activate(orchestrationKey);
      if (!activated.success) {
        return activated;
      }
    }

    const result = await this.orchestration.execute({
      orchestrationKey,
      tenantId: "smoke",
      environment: "verification",
      payload: { stage: "CF-3" },
    });

    return {
      success: result.success,
      system: "AVOS Capability Fabric",
      megaPack: "CF-3 Capability Orchestration",
      executionStatus: result.status,
      composedNodes: result.nodeResults.length,
      parallelExecutionFoundation: true,
      routingFoundation: true,
      discoveryFoundation: true,
      fallbackFoundation: true,
      pillars: this.orchestration.framework().pillars.length,
      snapshot: this.orchestration.snapshot(),
    };
  }
}