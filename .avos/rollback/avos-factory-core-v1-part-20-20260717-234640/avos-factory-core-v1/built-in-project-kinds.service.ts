import { Injectable, OnModuleInit } from "@nestjs/common";
import { ProjectKindRegistryService } from "./project-kind-registry.service";
import { ProjectStructureFactoryService } from "./project-structure-factory.service";

@Injectable()
export class BuiltInProjectKindsService implements OnModuleInit {
  constructor(
    private readonly registry: ProjectKindRegistryService,
    private readonly factory: ProjectStructureFactoryService
  ) {}

  onModuleInit(): void {
    if (!this.registry.has("nestjs-api")) {
      this.registry.register({
        kind: "nestjs-api", name: "NestJS API", description: "Standalone NestJS API.",
        defaultFeatures: ["health", "documentation"],
        supportedFeatures: ["health", "documentation", "database", "authentication", "authorization", "observability"],
        requiresHumanApproval: false,
        structureFactory: (request, variables) => this.factory.createNestJsApi(request, variables)
      });
    }
    if (!this.registry.has("nestjs-module")) {
      this.registry.register({
        kind: "nestjs-module", name: "NestJS Module", description: "Reusable NestJS module.",
        defaultFeatures: [], supportedFeatures: ["service", "controller", "repository", "tests"],
        requiresHumanApproval: false,
        structureFactory: (request, variables) => this.factory.createNestJsModule(request, variables)
      });
    }
    if (!this.registry.has("typescript-library")) {
      this.registry.register({
        kind: "typescript-library", name: "TypeScript Library", description: "Strict TypeScript library.",
        defaultFeatures: ["declarations"], supportedFeatures: ["declarations", "tests", "documentation"],
        requiresHumanApproval: false,
        structureFactory: (request, variables) => this.factory.createTypeScriptLibrary(request, variables)
      });
    }
  }
}
