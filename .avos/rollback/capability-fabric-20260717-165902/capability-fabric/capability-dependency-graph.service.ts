import { Injectable } from "@nestjs/common";
import {
  CapabilityDependency,
  CapabilityDigitalDNA,
} from "./capability-fabric.types";

@Injectable()
export class CapabilityDependencyGraphService {
  build(capabilities: CapabilityDigitalDNA[]) {
    const known = new Set(capabilities.map((capability) => capability.identity.key));
    const edges = capabilities.flatMap((capability) =>
      capability.dependencies.map((dependency) => ({
        from: capability.identity.key,
        to: dependency.capabilityKey,
        type: dependency.type,
        required: dependency.required,
        versionRange: dependency.versionRange,
        resolved: known.has(dependency.capabilityKey),
      })),
    );

    return {
      nodes: capabilities.map((capability) => ({
        key: capability.identity.key,
        name: capability.identity.name,
        kind: capability.identity.kind,
        status: capability.operationalStatus,
      })),
      edges,
      unresolvedRequired: edges.filter(
        (edge) => edge.required && !edge.resolved,
      ),
      cycles: this.detectCycles(capabilities),
      generatedAt: new Date().toISOString(),
    };
  }

  dependents(
    capabilityKey: string,
    capabilities: CapabilityDigitalDNA[],
  ): string[] {
    return capabilities
      .filter((capability) =>
        capability.dependencies.some(
          (dependency) => dependency.capabilityKey === capabilityKey,
        ),
      )
      .map((capability) => capability.identity.key);
  }

  canArchive(
    capabilityKey: string,
    capabilities: CapabilityDigitalDNA[],
  ) {
    const blockingDependents = capabilities.filter((capability) =>
      capability.dependencies.some(
        (dependency) =>
          dependency.capabilityKey === capabilityKey &&
          dependency.required &&
          capability.operationalStatus !== "ARCHIVED",
      ),
    );

    return {
      allowed: blockingDependents.length === 0,
      blockingDependents: blockingDependents.map(
        (capability) => capability.identity.key,
      ),
    };
  }

  private detectCycles(capabilities: CapabilityDigitalDNA[]): string[][] {
    const adjacency = new Map<string, CapabilityDependency[]>();
    for (const capability of capabilities) {
      adjacency.set(capability.identity.key, capability.dependencies);
    }

    const cycles: string[][] = [];
    const visiting = new Set<string>();
    const visited = new Set<string>();
    const path: string[] = [];

    const visit = (key: string) => {
      if (visiting.has(key)) {
        const start = path.indexOf(key);
        cycles.push([...path.slice(start), key]);
        return;
      }
      if (visited.has(key)) return;

      visiting.add(key);
      path.push(key);

      for (const dependency of adjacency.get(key) ?? []) {
        if (adjacency.has(dependency.capabilityKey)) {
          visit(dependency.capabilityKey);
        }
      }

      path.pop();
      visiting.delete(key);
      visited.add(key);
    };

    for (const key of adjacency.keys()) {
      visit(key);
    }

    return cycles;
  }
}