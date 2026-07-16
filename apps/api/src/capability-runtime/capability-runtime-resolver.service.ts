import { Injectable } from "@nestjs/common";
import { CapabilityRegistryService } from "../capability-fabric/capability-registry.service";
import { CapabilityRuntimeResolution } from "./capability-runtime.types";

@Injectable()
export class CapabilityRuntimeResolverService {
  constructor(private readonly registry: CapabilityRegistryService) {}

  resolve(capabilityKey: string): CapabilityRuntimeResolution {
    const capability = this.registry.get(capabilityKey);
    if (!capability) {
      return {
        success: false,
        capabilityKey,
        resolvedDependencies: [],
        unresolvedDependencies: [],
        blockedByCycles: false,
        cycles: [],
        reason: "CAPABILITY_NOT_REGISTERED",
      };
    }

    if (
      capability.operationalStatus === "ARCHIVED" ||
      capability.operationalStatus === "DEPRECATED"
    ) {
      return {
        success: false,
        capabilityKey,
        capabilityVersion: capability.version,
        resolvedDependencies: [],
        unresolvedDependencies: [],
        blockedByCycles: false,
        cycles: [],
        reason: `CAPABILITY_${capability.operationalStatus}`,
      };
    }

    const graph = this.registry.dependencyGraph();
    const nodeKeys = new Set(graph.nodes.map((node) => node.key));
    const dependencies = capability.dependencies.filter(
      (dependency) => dependency.required,
    );
    const resolvedDependencies = dependencies
      .filter((dependency) => nodeKeys.has(dependency.capabilityKey))
      .map((dependency) => dependency.capabilityKey);
    const unresolvedDependencies = dependencies
      .filter((dependency) => !nodeKeys.has(dependency.capabilityKey))
      .map((dependency) => dependency.capabilityKey);
    const cycles = graph.cycles.filter((cycle) =>
      cycle.includes(capability.identity.key),
    );

    return {
      success: unresolvedDependencies.length === 0 && cycles.length === 0,
      capabilityKey: capability.identity.key,
      capabilityVersion: capability.version,
      resolvedDependencies,
      unresolvedDependencies,
      blockedByCycles: cycles.length > 0,
      cycles,
      reason:
        unresolvedDependencies.length > 0
          ? "UNRESOLVED_REQUIRED_DEPENDENCIES"
          : cycles.length > 0
            ? "DEPENDENCY_CYCLE_DETECTED"
            : undefined,
    };
  }
}