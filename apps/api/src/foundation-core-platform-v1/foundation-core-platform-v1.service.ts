import { Injectable } from "@nestjs/common";
import { FoundationCapabilityRegistryV1Service } from "./foundation-capability-registry-v1.service";
import { FoundationDependencyGraphV1Service } from "./foundation-dependency-graph-v1.service";
import { FoundationFeatureFlagsV1Service } from "./foundation-feature-flags-v1.service";
import { FoundationKernelLifecycleV1Service } from "./foundation-kernel-lifecycle-v1.service";
import { FoundationLivingArchitectureV1Service } from "./foundation-living-architecture-v1.service";
import { FoundationModuleRuntimeV1Service } from "./foundation-module-runtime-v1.service";
import { FoundationPlatformHealthV1Service } from "./foundation-platform-health-v1.service";
import { FoundationPluginFrameworkV1Service } from "./foundation-plugin-framework-v1.service";
import type {
  FoundationCoreMetricsV1,
  FoundationCoreStatusV1,
} from "./foundation-core-platform-v1.types";

@Injectable()
export class FoundationCorePlatformV1Service {
  constructor(
    private readonly lifecycle: FoundationKernelLifecycleV1Service,
    private readonly modules: FoundationModuleRuntimeV1Service,
    private readonly plugins: FoundationPluginFrameworkV1Service,
    private readonly dependencies: FoundationDependencyGraphV1Service,
    private readonly capabilities: FoundationCapabilityRegistryV1Service,
    private readonly featureFlags: FoundationFeatureFlagsV1Service,
    private readonly architecture: FoundationLivingArchitectureV1Service,
    private readonly healthService: FoundationPlatformHealthV1Service,
  ) {}

  metrics(): FoundationCoreMetricsV1 {
    return {
      modules: this.modules.count(),
      plugins: this.plugins.count(),
      capabilities: this.capabilities.count(),
      featureFlags: this.featureFlags.count(),
      architectureRecords: this.architecture.count(),
      circularDependencies: this.dependencies.circularCount(),
      enabledPlugins: this.plugins.enabledCount(),
      activeCapabilities: this.capabilities.activeCount(),
    };
  }

  status(): FoundationCoreStatusV1 {
    const runtime = this.lifecycle.snapshot();

    return {
      success: true,
      system: "AVOS Foundation Core Platform V1",
      version: "1.0.0",
      runtime,
      metrics: this.metrics(),
      health: this.healthService.check(),
    };
  }

  diagnostics() {
    return {
      success: true,
      status: this.status(),
      modules: this.modules.list(),
      plugins: this.plugins.list(),
      dependencyGraph: this.dependencies.build(),
      capabilities: this.capabilities.list(),
      featureFlags: this.featureFlags.list(),
      architecture: this.architecture.list(),
    };
  }
}
