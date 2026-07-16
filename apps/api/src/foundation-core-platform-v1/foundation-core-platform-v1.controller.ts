import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { FoundationCapabilityRegistryV1Service } from "./foundation-capability-registry-v1.service";
import { FoundationCorePlatformV1Service } from "./foundation-core-platform-v1.service";
import { FoundationFeatureFlagsV1Service } from "./foundation-feature-flags-v1.service";
import { FoundationKernelLifecycleV1Service } from "./foundation-kernel-lifecycle-v1.service";
import { FoundationLivingArchitectureV1Service } from "./foundation-living-architecture-v1.service";
import { FoundationModuleRuntimeV1Service } from "./foundation-module-runtime-v1.service";
import { FoundationPluginFrameworkV1Service } from "./foundation-plugin-framework-v1.service";
import { FoundationVersionCompatibilityV1Service } from "./foundation-version-compatibility-v1.service";
import type {
  FoundationCapabilityRecordV1,
  FoundationFeatureFlagV1,
  FoundationModuleRecordV1,
  FoundationPluginManifestV1,
  LivingArchitectureRecordV1,
} from "./foundation-core-platform-v1.types";

@Controller("foundation-core-platform-v1")
export class FoundationCorePlatformV1Controller {
  constructor(
    private readonly platform: FoundationCorePlatformV1Service,
    private readonly lifecycle: FoundationKernelLifecycleV1Service,
    private readonly modules: FoundationModuleRuntimeV1Service,
    private readonly plugins: FoundationPluginFrameworkV1Service,
    private readonly capabilities: FoundationCapabilityRegistryV1Service,
    private readonly featureFlags: FoundationFeatureFlagsV1Service,
    private readonly compatibility: FoundationVersionCompatibilityV1Service,
    private readonly architecture: FoundationLivingArchitectureV1Service,
  ) {}

  @Get("status")
  status() {
    return this.platform.status();
  }

  @Get("diagnostics")
  diagnostics() {
    return this.platform.diagnostics();
  }

  @Post("lifecycle/start")
  start(@Body() body: { metadata?: Record<string, unknown> }) {
    return {
      success: true,
      runtime: this.lifecycle.start(body.metadata),
    };
  }

  @Post("modules")
  registerModule(
    @Body()
    body: Omit<FoundationModuleRecordV1, "createdAt" | "updatedAt">,
  ) {
    return {
      success: true,
      module: this.modules.register(body),
    };
  }

  @Post("plugins")
  registerPlugin(
    @Body()
    body: Omit<FoundationPluginManifestV1, "createdAt" | "updatedAt">,
  ) {
    return {
      success: true,
      plugin: this.plugins.register(body),
    };
  }

  @Post("capabilities")
  registerCapability(
    @Body()
    body: Omit<FoundationCapabilityRecordV1, "createdAt" | "updatedAt">,
  ) {
    return {
      success: true,
      capability: this.capabilities.register(body),
    };
  }

  @Post("capabilities/:id/status")
  transitionCapability(
    @Param("id") id: string,
    @Body() body: { status: FoundationCapabilityRecordV1["status"] },
  ) {
    return {
      success: true,
      capability: this.capabilities.transition(id, body.status),
    };
  }

  @Post("feature-flags")
  upsertFeatureFlag(
    @Body() body: Omit<FoundationFeatureFlagV1, "updatedAt">,
  ) {
    return {
      success: true,
      featureFlag: this.featureFlags.upsert(body),
    };
  }

  @Post("compatibility/check")
  checkCompatibility(
    @Body()
    body: {
      currentVersion: string;
      requiredRange: string;
    },
  ) {
    return {
      success: true,
      result: this.compatibility.check(
        body.currentVersion,
        body.requiredRange,
      ),
    };
  }

  @Post("architecture")
  upsertArchitecture(
    @Body() body: Omit<LivingArchitectureRecordV1, "updatedAt">,
  ) {
    return {
      success: true,
      architecture: this.architecture.upsert(body),
    };
  }
}
