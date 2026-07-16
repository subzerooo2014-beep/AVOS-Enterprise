import { Module } from "@nestjs/common";
import { FoundationCapabilityRegistryV1Service } from "./foundation-capability-registry-v1.service";
import { FoundationCorePlatformV1Controller } from "./foundation-core-platform-v1.controller";
import { FoundationCorePlatformV1Service } from "./foundation-core-platform-v1.service";
import { FoundationDependencyGraphV1Service } from "./foundation-dependency-graph-v1.service";
import { FoundationFeatureFlagsV1Service } from "./foundation-feature-flags-v1.service";
import { FoundationKernelLifecycleV1Service } from "./foundation-kernel-lifecycle-v1.service";
import { FoundationLivingArchitectureV1Service } from "./foundation-living-architecture-v1.service";
import { FoundationModuleRuntimeV1Service } from "./foundation-module-runtime-v1.service";
import { FoundationPlatformHealthV1Service } from "./foundation-platform-health-v1.service";
import { FoundationPluginFrameworkV1Service } from "./foundation-plugin-framework-v1.service";
import { FoundationVersionCompatibilityV1Service } from "./foundation-version-compatibility-v1.service";

@Module({
  controllers: [FoundationCorePlatformV1Controller],
  providers: [
    FoundationCapabilityRegistryV1Service,
    FoundationCorePlatformV1Service,
    FoundationDependencyGraphV1Service,
    FoundationFeatureFlagsV1Service,
    FoundationKernelLifecycleV1Service,
    FoundationLivingArchitectureV1Service,
    FoundationModuleRuntimeV1Service,
    FoundationPlatformHealthV1Service,
    FoundationPluginFrameworkV1Service,
    FoundationVersionCompatibilityV1Service,
  ],
  exports: [
    FoundationCapabilityRegistryV1Service,
    FoundationCorePlatformV1Service,
    FoundationDependencyGraphV1Service,
    FoundationFeatureFlagsV1Service,
    FoundationKernelLifecycleV1Service,
    FoundationLivingArchitectureV1Service,
    FoundationModuleRuntimeV1Service,
    FoundationPlatformHealthV1Service,
    FoundationPluginFrameworkV1Service,
    FoundationVersionCompatibilityV1Service,
  ],
})
export class FoundationCorePlatformV1Module {}
