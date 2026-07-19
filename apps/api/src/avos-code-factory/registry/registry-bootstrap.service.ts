import { Injectable, OnModuleInit } from "@nestjs/common";
import { FactoryCompilerRegistryService } from "./compiler-registry.service";
import { FactoryGeneratorRegistryService } from "./generator-registry.service";
import { FactoryTemplateRegistryService } from "./template-registry.service";

@Injectable()
export class FactoryRegistryBootstrapService implements OnModuleInit {
  constructor(
    private readonly generators: FactoryGeneratorRegistryService,
    private readonly compilers: FactoryCompilerRegistryService,
    private readonly templates: FactoryTemplateRegistryService,
  ) {}

  onModuleInit(): void {
    this.generators.register({
      id: "core-typescript-generator",
      name: "Core TypeScript Generator",
      version: "1.0.0",
      artifactTypes: ["source", "test", "documentation"],
      languages: ["typescript"],
      enabled: true,
      metadata: { builtIn: true },
    });

    this.compilers.register({
      id: "blueprint-ir-compiler",
      name: "Blueprint IR Compiler",
      version: "1.0.0",
      inputFormats: ["prompt", "blueprint-json"],
      outputFormats: ["blueprint-ir"],
      enabled: true,
      metadata: { builtIn: true },
    });

    this.templates.register({
      id: "nestjs-service-template",
      name: "NestJS Service Template",
      category: "nestjs",
      language: "typescript",
      content:
        'import { Injectable } from "@nestjs/common";\n\n@Injectable()\nexport class {{className}}Service {}\n',
      variables: ["className"],
      version: "1.0.0",
      enabled: true,
      metadata: { builtIn: true },
    });
  }

  summary() {
    return {
      generators: this.generators.list().length,
      compilers: this.compilers.list().length,
      templates: this.templates.list().length,
    };
  }
}
