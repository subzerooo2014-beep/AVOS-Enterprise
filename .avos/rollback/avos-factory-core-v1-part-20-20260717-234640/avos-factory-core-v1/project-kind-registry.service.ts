import { Injectable } from "@nestjs/common";
import { ProjectKind, ProjectKindDefinition } from "./project-generator.contracts";
import { ProjectKindNotFoundError } from "./project-generator.errors";

@Injectable()
export class ProjectKindRegistryService {
  private readonly definitions = new Map<ProjectKind, ProjectKindDefinition>();

  register(definition: ProjectKindDefinition): ProjectKindDefinition {
    if (this.definitions.has(definition.kind)) {
      throw new Error(`Project kind "${definition.kind}" is already registered.`);
    }
    this.definitions.set(definition.kind, definition);
    return definition;
  }

  resolve(kind: ProjectKind): ProjectKindDefinition {
    const definition = this.definitions.get(kind);
    if (!definition) throw new ProjectKindNotFoundError(kind);
    return definition;
  }

  has(kind: ProjectKind): boolean { return this.definitions.has(kind); }
  count(): number { return this.definitions.size; }

  list() {
    return [...this.definitions.values()].map((item) => ({
      kind: item.kind,
      name: item.name,
      description: item.description,
      defaultFeatures: [...item.defaultFeatures],
      supportedFeatures: [...item.supportedFeatures],
      requiresHumanApproval: item.requiresHumanApproval
    }));
  }
}
