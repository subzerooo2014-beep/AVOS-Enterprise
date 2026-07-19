import { Injectable } from "@nestjs/common";
import {
  CompiledApplication,
  CompiledCapability,
  CompiledFactoryBlueprint,
} from "../contracts/autonomous-factory.contracts";
import { GenerateProjectDto } from "../dto/generate-project.dto";
import { FactoryTemplateIntelligenceService } from "./template-intelligence.service";

@Injectable()
export class FactoryArchitectureGeneratorService {
  constructor(
    private readonly templates: FactoryTemplateIntelligenceService,
  ) {}

  generateApplication(
    blueprint: CompiledFactoryBlueprint,
    application: CompiledApplication,
  ): GenerateProjectDto {
    const capabilities = blueprint.capabilities.filter((capability) =>
      application.capabilityIds.includes(capability.id),
    );

    const files: GenerateProjectDto["files"] = [];

    for (const capability of capabilities) {
      files.push(
        ...this.generateCapabilityFiles(
          blueprint,
          application,
          capability,
        ),
      );
    }

    files.push(
      ...this.generateApplicationFiles(
        blueprint,
        application,
        capabilities,
      ),
    );

    return {
      projectId: blueprint.projectId,
      name: application.name,
      objective: application.objective,
      language:
        application.framework === "flutter"
          ? "dart"
          : "typescript",
      framework: application.framework,
      metadata: {
        blueprintId: blueprint.id,
        applicationId: application.id,
        autonomousFactory: true,
        humanFinalAuthority: true,
        capabilityCount: capabilities.length,
      },
      files,
    };
  }

  private generateCapabilityFiles(
    blueprint: CompiledFactoryBlueprint,
    application: CompiledApplication,
    capability: CompiledCapability,
  ): GenerateProjectDto["files"] {
    const selection = this.templates.selectForCapability(
      capability,
      application.framework,
    );

    if (application.framework !== "nestjs") {
      return [
        {
          path: `src/capabilities/${capability.slug}/capability.manifest.json`,
          type: "metadata",
          content: JSON.stringify(
            this.manifest(blueprint, capability, selection.pattern),
            null,
            2,
          ),
        },
        {
          path: `src/capabilities/${capability.slug}/README.md`,
          type: "documentation",
          content: `# ${capability.name}\n\n${capability.objective}\n`,
        },
      ];
    }

    const base = `src/capabilities/${capability.slug}`;
    const files: GenerateProjectDto["files"] = [
      {
        path: `${base}/${capability.slug}.contracts.ts`,
        type: "source",
        content: `export interface ${capability.className}Command {\n  objective: string;\n  payload?: Record<string, unknown>;\n  requestedBy: string;\n}\n\nexport interface ${capability.className}Result {\n  success: boolean;\n  capabilityId: "${capability.id}";\n  objective: string;\n  requiresHumanApproval: boolean;\n  evidence: string[];\n  executedAt: string;\n}\n`,
      },
      {
        path: `${base}/${capability.slug}.service.ts`,
        type: "source",
        content: `import { Injectable } from "@nestjs/common";\nimport { ${capability.className}Command, ${capability.className}Result } from "./${capability.slug}.contracts";\n\n@Injectable()\nexport class ${capability.className}Service {\n  execute(command: ${capability.className}Command): ${capability.className}Result {\n    return {\n      success: true,\n      capabilityId: "${capability.id}",\n      objective: command.objective,\n      requiresHumanApproval: ${capability.humanApprovalRequired},\n      evidence: ["generated-by-avos-code-factory", "blueprint:${blueprint.id}"],\n      executedAt: new Date().toISOString(),\n    };\n  }\n}\n`,
      },
      {
        path: `${base}/${capability.slug}.module.ts`,
        type: "source",
        content: `import { Module } from "@nestjs/common";\n${selection.includeController ? `import { ${capability.className}Controller } from "./${capability.slug}.controller";\n` : ""}import { ${capability.className}Service } from "./${capability.slug}.service";\n\n@Module({\n  providers: [${capability.className}Service],\n  ${selection.includeController ? `controllers: [${capability.className}Controller],\n  ` : ""}exports: [${capability.className}Service],\n})\nexport class ${capability.className}Module {}\n`,
      },
      {
        path: `${base}/${capability.slug}.service.spec.ts`,
        type: "test",
        content: `import { ${capability.className}Service } from "./${capability.slug}.service";\n\ndescribe("${capability.className}Service", () => {\n  it("executes with traceability", () => {\n    const service = new ${capability.className}Service();\n    const result = service.execute({ objective: "test", requestedBy: "human:test" });\n    expect(result.success).toBe(true);\n    expect(result.evidence.length).toBeGreaterThan(0);\n  });\n});\n`,
      },
      {
        path: `${base}/capability.manifest.json`,
        type: "metadata",
        content: JSON.stringify(
          this.manifest(blueprint, capability, selection.pattern),
          null,
          2,
        ),
      },
      {
        path: `${base}/README.md`,
        type: "documentation",
        content: `# ${capability.name}\n\n${capability.objective}\n\nLifecycle: Prototype\n\nHuman Final Authority: Preserved\n`,
      },
    ];

    if (selection.includeController) {
      files.push({
        path: `${base}/${capability.slug}.controller.ts`,
        type: "source",
        content: `import { Body, Controller, Post } from "@nestjs/common";\nimport { ${capability.className}Command } from "./${capability.slug}.contracts";\nimport { ${capability.className}Service } from "./${capability.slug}.service";\n\n@Controller("avos/capabilities/${capability.slug}")\nexport class ${capability.className}Controller {\n  constructor(private readonly service: ${capability.className}Service) {}\n\n  @Post("execute")\n  execute(@Body() command: ${capability.className}Command) {\n    return this.service.execute(command);\n  }\n}\n`,
      });
    }

    if (selection.includePersistence) {
      files.push({
        path: `${base}/${capability.slug}.repository.ts`,
        type: "source",
        content: `import { Injectable } from "@nestjs/common";\n\n@Injectable()\nexport class ${capability.className}Repository {\n  private readonly records: Record<string, unknown>[] = [];\n\n  save(record: Record<string, unknown>) {\n    this.records.push(record);\n    return record;\n  }\n\n  list() {\n    return [...this.records];\n  }\n}\n`,
      });
    }

    return files;
  }

  private generateApplicationFiles(
    blueprint: CompiledFactoryBlueprint,
    application: CompiledApplication,
    capabilities: CompiledCapability[],
  ): GenerateProjectDto["files"] {
    if (application.framework !== "nestjs") {
      return [
        {
          path: "avos.application.manifest.json",
          type: "metadata",
          content: JSON.stringify(
            {
              id: application.id,
              name: application.name,
              framework: application.framework,
              capabilities: capabilities.map((capability) => capability.id),
              blueprintId: blueprint.id,
              humanFinalAuthority: true,
            },
            null,
            2,
          ),
        },
      ];
    }

    const imports = capabilities
      .map(
        (capability) =>
          `import { ${capability.className}Module } from "./capabilities/${capability.slug}/${capability.slug}.module";`,
      )
      .join("\n");

    const moduleNames = capabilities
      .map((capability) => `${capability.className}Module`)
      .join(", ");

    return [
      {
        path: "src/app.module.ts",
        type: "source",
        content: `import { Module } from "@nestjs/common";\n${imports}\n\n@Module({\n  imports: [${moduleNames}],\n})\nexport class AppModule {}\n`,
      },
      {
        path: "src/main.ts",
        type: "source",
        content: `import { NestFactory } from "@nestjs/core";\nimport { AppModule } from "./app.module";\n\nasync function bootstrap() {\n  const app = await NestFactory.create(AppModule);\n  await app.listen(process.env.PORT ?? 3000);\n}\n\nvoid bootstrap();\n`,
      },
      {
        path: "package.json",
        type: "package",
        content: JSON.stringify(
          {
            name: application.slug,
            version: blueprint.version,
            private: true,
            scripts: {
              build: "nest build",
              start: "nest start",
              "start:dev": "nest start --watch",
              test: "jest",
              typecheck: "tsc --noEmit",
            },
            dependencies: {
              "@nestjs/common": "^11.0.0",
              "@nestjs/core": "^11.0.0",
              "reflect-metadata": "^0.2.2",
              rxjs: "^7.8.1",
            },
            devDependencies: {
              "@nestjs/cli": "^11.0.0",
              "@types/jest": "^29.5.14",
              "@types/node": "^22.0.0",
              jest: "^29.7.0",
              "ts-jest": "^29.2.5",
              typescript: "^6.0.0",
            },
          },
          null,
          2,
        ),
      },
      {
        path: "tsconfig.json",
        type: "configuration",
        content: JSON.stringify(
          {
            compilerOptions: {
              target: "ES2022",
              module: "commonjs",
              declaration: true,
              strict: true,
              sourceMap: true,
              outDir: "./dist",
              baseUrl: "./",
              incremental: true,
              skipLibCheck: true,
              experimentalDecorators: true,
              emitDecoratorMetadata: true,
              esModuleInterop: true,
            },
            include: ["src/**/*.ts"],
          },
          null,
          2,
        ),
      },
      {
        path: "nest-cli.json",
        type: "configuration",
        content: JSON.stringify(
          {
            collection: "@nestjs/schematics",
            sourceRoot: "src",
          },
          null,
          2,
        ),
      },
      {
        path: "README.md",
        type: "documentation",
        content: `# ${application.name}\n\n${application.objective}\n\nGenerated by AVOS Autonomous Software Factory.\n`,
      },
      {
        path: "avos.application.manifest.json",
        type: "metadata",
        content: JSON.stringify(
          {
            id: application.id,
            name: application.name,
            objective: application.objective,
            framework: application.framework,
            capabilities: capabilities.map((capability) => capability.id),
            blueprintId: blueprint.id,
            architecture: "capability-first",
            foundationFirst: true,
            humanFinalAuthority: true,
          },
          null,
          2,
        ),
      },
    ];
  }

  private manifest(
    blueprint: CompiledFactoryBlueprint,
    capability: CompiledCapability,
    templatePattern: string,
  ) {
    return {
      id: capability.id,
      name: capability.name,
      version: capability.version,
      objective: capability.objective,
      dependencies: capability.dependencies,
      lifecycle: "prototype",
      templatePattern,
      persistence: capability.persistence,
      humanApprovalRequired: capability.humanApprovalRequired,
      humanFinalAuthority: true,
      blueprintId: blueprint.id,
      generatedBy: "avos-autonomous-software-factory",
    };
  }
}
