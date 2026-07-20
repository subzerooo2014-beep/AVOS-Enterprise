import { Injectable } from '@nestjs/common';
import { CapabilityDependencyNode } from '../domain/capability-runtime.types';
import { CapabilityDiscoveryRegistryService } from './capability-discovery-registry.service';

@Injectable()
export class CapabilityDependencyGraphService {
  constructor(
    private readonly discovery: CapabilityDiscoveryRegistryService,
  ) {}

  graph(): CapabilityDependencyNode[] {
    const capabilities = this.discovery.list();
    const ids = new Set(capabilities.map((item) => item.id));

    return capabilities.map((capability) => {
      const dependents = capabilities
        .filter((item) =>
          item.dependencies.includes(capability.id),
        )
        .map((item) => item.id);

      const missingDependencies = capability.dependencies.filter(
        (dependency) => !ids.has(dependency),
      );

      return {
        capabilityId: capability.id,
        dependencies: capability.dependencies,
        dependents,
        missingDependencies,
        cyclic: this.hasCycle(capability.id, new Set(), new Set()),
      };
    });
  }

  validate(): {
    valid: boolean;
    missingDependencies: string[];
    cyclicCapabilities: string[];
  } {
    const graph = this.graph();
    const missingDependencies = graph.flatMap((node) =>
      node.missingDependencies.map(
        (dependency) => `${node.capabilityId}->${dependency}`,
      ),
    );
    const cyclicCapabilities = graph
      .filter((node) => node.cyclic)
      .map((node) => node.capabilityId);

    return {
      valid:
        missingDependencies.length === 0 &&
        cyclicCapabilities.length === 0,
      missingDependencies,
      cyclicCapabilities,
    };
  }

  private hasCycle(
    capabilityId: string,
    visiting: Set<string>,
    visited: Set<string>,
  ): boolean {
    if (visiting.has(capabilityId)) {
      return true;
    }
    if (visited.has(capabilityId)) {
      return false;
    }

    visiting.add(capabilityId);
    const capability = this.discovery.get(capabilityId);

    for (const dependency of capability?.dependencies ?? []) {
      if (this.hasCycle(dependency, visiting, visited)) {
        return true;
      }
    }

    visiting.delete(capabilityId);
    visited.add(capabilityId);
    return false;
  }
}