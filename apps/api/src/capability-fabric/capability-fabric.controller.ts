import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { CapabilityRegistryService } from "./capability-registry.service";
import {
  CapabilityLifecycleStage,
  CapabilityOperationalStatus,
  CapabilityRegistrationInput,
} from "./capability-fabric.types";

@Controller("capability-fabric")
export class CapabilityFabricController {
  constructor(private readonly registry: CapabilityRegistryService) {}

  @Get("status")
  status() {
    return this.registry.framework();
  }

  @Get("capabilities")
  list(
    @Query("kind") kind?: string,
    @Query("lifecycleStage") lifecycleStage?: string,
    @Query("status") status?: string,
    @Query("tag") tag?: string,
  ) {
    return {
      success: true,
      capabilities: this.registry.list({
        kind,
        lifecycleStage,
        status,
        tag,
      }),
    };
  }

  @Post("capabilities")
  register(@Body() body: CapabilityRegistrationInput) {
    return this.registry.register(body);
  }

  @Get("capabilities/:key")
  get(@Param("key") key: string) {
    return {
      success: true,
      capability: this.registry.get(key),
    };
  }

  @Patch("capabilities/:key/status")
  transitionStatus(
    @Param("key") key: string,
    @Body() body: { status: CapabilityOperationalStatus },
  ) {
    return this.registry.transitionStatus(key, body.status);
  }

  @Post("capabilities/:key/evolve")
  evolve(
    @Param("key") key: string,
    @Body()
    body: {
      target: CapabilityLifecycleStage;
      reason: string;
      approvedBy: string;
    },
  ) {
    return this.registry.evolve(
      key,
      body.target,
      body.reason,
      body.approvedBy,
    );
  }

  @Post("capabilities/:key/versions")
  releaseVersion(
    @Param("key") key: string,
    @Body()
    body: {
      version: string;
      changeType: "MAJOR" | "MINOR" | "PATCH";
      changes: string[];
      compatibleWith?: string[];
      migrationRef?: string;
    },
  ) {
    return this.registry.releaseVersion(key, body);
  }

  @Get("capabilities/:key/validate")
  validate(@Param("key") key: string) {
    return this.registry.validate(key);
  }

  @Get("dependency-graph")
  dependencyGraph() {
    return this.registry.dependencyGraph();
  }

  @Get("snapshot")
  snapshot() {
    return {
      success: true,
      snapshot: this.registry.snapshot(),
    };
  }

  @Post("smoke")
  smoke() {
    const first = this.registry.register({
      key: "avos.capability-fabric.registry",
      name: "Capability Registry Core",
      kind: "PLATFORM_SERVICE",
      owner: "AVOS Enterprise Kernel",
      summary: "Canonical registry for reusable AVOS capabilities.",
      businessValue:
        "Creates one governed source of truth for capability identity and composition.",
      version: "1.0.0",
      lifecycleStage: "CORE_ENGINE",
      criticality: "MISSION_CRITICAL",
      tags: ["foundation", "registry", "capability-fabric"],
      categories: ["platform", "architecture"],
      contracts: [
        {
          id: "capability-registry-api-v1",
          name: "Capability Registry API",
          version: "1.0.0",
          type: "API",
          compatibility: "BACKWARD",
          required: true,
        },
      ],
      events: [
        {
          name: "capability.registered",
          version: "1.0.0",
          direction: "PUBLISHES",
          durable: true,
        },
      ],
      metrics: [
        {
          name: "registered_capabilities",
          unit: "count",
          type: "GAUGE",
          target: 1,
        },
      ],
      health: {
        healthEndpoint: "/capability-fabric/status",
        readinessEndpoint: "/capability-fabric/snapshot",
      },
      runtime: {
        runtime: "NODE",
        moduleRef: "CapabilityFabricModule",
        serviceRef: "CapabilityRegistryService",
        controllerRef: "CapabilityFabricController",
        stateless: false,
        multiTenant: true,
        supportsIsolation: true,
      },
      security: {
        classification: "INTERNAL",
        authenticationRequired: true,
        authorizationRequired: true,
        dataSensitivity: ["architecture-metadata"],
        trustBoundary: "AVOS_ENTERPRISE_PLATFORM",
      },
    });

    const existing = this.registry.get("avos.capability-fabric.registry");
    if (!existing) {
      throw new Error("Capability Fabric smoke registration failed.");
    }

    const activation =
      existing.operationalStatus === "REGISTERED"
        ? this.registry.transitionStatus(
            "avos.capability-fabric.registry",
            "ACTIVE",
          )
        : { success: true, capability: existing };

    return {
      success: first.success || first.reason === "CAPABILITY_KEY_ALREADY_REGISTERED",
      system: "AVOS Capability Fabric",
      megaPack: "CF-1",
      registryOperational: activation.success,
      digitalDNAComplete: this.registry.validate(
        "avos.capability-fabric.registry",
      ).valid,
      pillars: this.registry.framework().capabilityPillars.length,
      snapshot: this.registry.snapshot(),
    };
  }
}