import { Injectable } from "@nestjs/common";
import { FoundationCapabilityRegistryV1Service } from "./foundation-capability-registry-v1.service";
import { FoundationDependencyGraphV1Service } from "./foundation-dependency-graph-v1.service";
import { FoundationKernelLifecycleV1Service } from "./foundation-kernel-lifecycle-v1.service";
import { FoundationModuleRuntimeV1Service } from "./foundation-module-runtime-v1.service";
import { FoundationPluginFrameworkV1Service } from "./foundation-plugin-framework-v1.service";
import type { PlatformHealthSnapshotV1 } from "./foundation-core-platform-v1.types";

@Injectable()
export class FoundationPlatformHealthV1Service {
  constructor(
    private readonly lifecycle: FoundationKernelLifecycleV1Service,
    private readonly modules: FoundationModuleRuntimeV1Service,
    private readonly plugins: FoundationPluginFrameworkV1Service,
    private readonly capabilities: FoundationCapabilityRegistryV1Service,
    private readonly dependencyGraph: FoundationDependencyGraphV1Service,
  ) {}

  check(): PlatformHealthSnapshotV1 {
    const runtime = this.lifecycle.snapshot();
    const circularDependencies = this.dependencyGraph.circularCount();
    const issues: string[] = [];
    let score = 100;

    if (runtime.status === "DEGRADED") {
      issues.push("Kernel lifecycle is degraded.");
      score -= 25;
    }

    if (runtime.status === "FAILED") {
      issues.push("Kernel lifecycle has failed.");
      score -= 70;
    }

    if (circularDependencies > 0) {
      issues.push(`Detected ${circularDependencies} circular dependency nodes.`);
      score -= Math.min(40, circularDependencies * 10);
    }

    score = Math.max(0, score);

    return {
      status:
        score >= 80 ? "HEALTHY" : score >= 50 ? "DEGRADED" : "UNHEALTHY",
      score,
      issues,
      checkedAt: new Date().toISOString(),
      components: {
        kernelLifecycle: runtime.status,
        moduleRuntime: this.modules.count() >= 0 ? "READY" : "UNKNOWN",
        pluginFramework: this.plugins.count() >= 0 ? "READY" : "UNKNOWN",
        capabilityRegistry: this.capabilities.count() >= 0 ? "READY" : "UNKNOWN",
        dependencyGraph:
          circularDependencies === 0 ? "READY" : "DEGRADED",
      },
    };
  }
}
