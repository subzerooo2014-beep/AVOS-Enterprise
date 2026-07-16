import { Injectable } from "@nestjs/common";
import { FoundationModuleRuntimeV1Service } from "./foundation-module-runtime-v1.service";
import type { FoundationDependencyNodeV1 } from "./foundation-core-platform-v1.types";

@Injectable()
export class FoundationDependencyGraphV1Service {
  constructor(private readonly modules: FoundationModuleRuntimeV1Service) {}

  build(): FoundationDependencyNodeV1[] {
    const modules = this.modules.list();
    const ids = new Set(modules.map((item) => item.id));

    return modules.map((item) => {
      const dependents = modules
        .filter((candidate) => candidate.dependencies.includes(item.id))
        .map((candidate) => candidate.id);

      const circular = this.hasCircularDependency(item.id, item.id, new Set());

      return {
        moduleId: item.id,
        dependencies: item.dependencies.filter((dependency) => ids.has(dependency)),
        dependents,
        circular,
      };
    });
  }

  circularCount(): number {
    return this.build().filter((item) => item.circular).length;
  }

  private hasCircularDependency(
    originId: string,
    currentId: string,
    visited: Set<string>,
  ): boolean {
    if (visited.has(currentId)) {
      return currentId === originId;
    }

    visited.add(currentId);

    let moduleRecord;

    try {
      moduleRecord = this.modules.get(currentId);
    } catch {
      return false;
    }

    for (const dependency of moduleRecord.dependencies) {
      if (dependency === originId) {
        return true;
      }

      if (
        this.hasCircularDependency(
          originId,
          dependency,
          new Set(visited),
        )
      ) {
        return true;
      }
    }

    return false;
  }
}
