import { Injectable } from "@nestjs/common";
import { GenesisBlueprint } from "../types/genesis-platform.types";

@Injectable()
export class BlueprintDependencyResolverService {
  resolve(blueprint: GenesisBlueprint): {
    orderedArtifactIds: string[];
    unresolvedDependencies: string[];
    cycleDetected: boolean;
  } {
    const byId = new Map(blueprint.artifacts.map((artifact) => [artifact.id, artifact]));
    const visiting = new Set<string>();
    const visited = new Set<string>();
    const ordered: string[] = [];
    const unresolved = new Set<string>();
    let cycleDetected = false;

    const visit = (id: string): void => {
      if (visited.has(id)) return;
      if (visiting.has(id)) {
        cycleDetected = true;
        return;
      }

      const artifact = byId.get(id);
      if (!artifact) {
        unresolved.add(id);
        return;
      }

      visiting.add(id);
      for (const dependency of artifact.dependencies) {
        if (!byId.has(dependency)) unresolved.add(dependency);
        else visit(dependency);
      }
      visiting.delete(id);
      visited.add(id);
      ordered.push(id);
    };

    for (const artifact of blueprint.artifacts) visit(artifact.id);

    return {
      orderedArtifactIds: ordered,
      unresolvedDependencies: [...unresolved],
      cycleDetected,
    };
  }
}
