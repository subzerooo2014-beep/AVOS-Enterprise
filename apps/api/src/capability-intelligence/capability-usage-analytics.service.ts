import { Injectable } from "@nestjs/common";
import { CapabilityRegistryService } from "../capability-fabric/capability-registry.service";
import { CapabilityRuntimeService } from "../capability-runtime/capability-runtime.service";
import { CapabilityOrchestrationRegistryService } from "../capability-orchestration/capability-orchestration-registry.service";
import { CapabilityUsageProfile } from "./capability-intelligence.types";

@Injectable()
export class CapabilityUsageAnalyticsService {
  constructor(
    private readonly registry: CapabilityRegistryService,
    private readonly runtime: CapabilityRuntimeService,
    private readonly orchestration: CapabilityOrchestrationRegistryService,
  ) {}

  profile(capabilityKey: string): CapabilityUsageProfile {
    const capability = this.registry.get(capabilityKey);
    if (!capability) {
      throw new Error(`Capability not found: ${capabilityKey}`);
    }

    const instances = this.runtime.list({ capabilityKey });
    const totalExecutions = instances.reduce(
      (total, instance) => total + instance.resources.totalExecutions,
      0,
    );
    const failedExecutions = instances.reduce(
      (total, instance) => total + instance.resources.failedExecutions,
      0,
    );
    const averageDurationMs =
      instances.length === 0
        ? 0
        : instances.reduce(
            (total, instance) =>
              total + instance.resources.averageDurationMs,
            0,
          ) / instances.length;

    const orchestrationReferences = this.orchestration
      .list()
      .reduce(
        (total, definition) =>
          total +
          definition.nodes.filter(
            (node) => node.capabilityKey === capability.identity.key,
          ).length,
        0,
      );

    const dependencyReferences = this.registry
      .list()
      .reduce(
        (total, item) =>
          total +
          item.dependencies.filter(
            (dependency) =>
              dependency.capabilityKey === capability.identity.key,
          ).length,
        0,
      );

    const reuseScore = Math.min(
      100,
      orchestrationReferences * 15 +
        dependencyReferences * 10 +
        Math.min(totalExecutions, 50),
    );

    return {
      capabilityKey: capability.identity.key,
      runtimeInstances: instances.length,
      totalExecutions,
      failedExecutions,
      successRate:
        totalExecutions === 0
          ? 100
          : ((totalExecutions - failedExecutions) / totalExecutions) * 100,
      averageDurationMs,
      orchestrationReferences,
      dependencyReferences,
      reuseScore,
      updatedAt: new Date().toISOString(),
    };
  }
}