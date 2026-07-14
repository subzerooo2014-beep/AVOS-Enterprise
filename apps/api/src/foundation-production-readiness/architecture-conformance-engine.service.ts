import { Injectable } from '@nestjs/common';
import { FoundationModule } from './foundation-production-readiness.types';

@Injectable()
export class ArchitectureConformanceEngineService {
  assess(modules: FoundationModule[]) {
    const registered = modules.filter((module) => module.registered);
    const dependencyIds = new Set(modules.map((module) => module.id));

    const missingDependencies = modules.flatMap((module) =>
      module.dependencies
        .filter((dependency) => !dependencyIds.has(dependency))
        .map((dependency) => `${module.id}:${dependency}`),
    );

    return {
      registeredModules: registered.length,
      moduleCount: modules.length,
      conformanceScore: Math.round(
        ((registered.length -
          Math.min(registered.length, missingDependencies.length)) /
          Math.max(1, modules.length)) *
          100,
      ),
      missingDependencies,
      conformant:
        registered.length === modules.length &&
        missingDependencies.length === 0,
    };
  }
}