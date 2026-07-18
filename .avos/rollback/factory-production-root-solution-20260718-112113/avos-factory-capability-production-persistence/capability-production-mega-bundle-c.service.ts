import { Injectable } from "@nestjs/common";
import { CapabilityProductionBlueprint } from "./capability-production-persistence.contracts";
import { CapabilityWorkspaceBuilderService } from "./capability-workspace-builder.service";
import { CapabilityControllerGeneratorService } from "./capability-controller-generator.service";
import { CapabilityDtoGeneratorService } from "./capability-dto-generator.service";
import { CapabilityValidationGeneratorService } from "./capability-validation-generator.service";
import { CapabilityUnitTestGeneratorService } from "./capability-unit-test-generator.service";
import { CapabilityIntegrationTestGeneratorService } from "./capability-integration-test-generator.service";
import { CapabilityBuildExecutionEngineService } from "./capability-build-execution-engine.service";
import { NestjsModuleComposerService } from "./nestjs-module-composer.service";
import { PhysicalFileWriterService } from "./physical-file-writer.service";

@Injectable()
export class CapabilityProductionMegaBundleCService {
  constructor(
    private readonly workspaces: CapabilityWorkspaceBuilderService,
    private readonly controllerGenerator: CapabilityControllerGeneratorService,
    private readonly dtoGenerator: CapabilityDtoGeneratorService,
    private readonly validationGenerator: CapabilityValidationGeneratorService,
    private readonly unitTestGenerator: CapabilityUnitTestGeneratorService,
    private readonly integrationTestGenerator: CapabilityIntegrationTestGeneratorService,
    private readonly buildEngine: CapabilityBuildExecutionEngineService,
    private readonly moduleComposer: NestjsModuleComposerService,
    private readonly writer: PhysicalFileWriterService
  ) {}

  generate(blueprint: CapabilityProductionBlueprint) {
    if (!blueprint.approvedBy.startsWith("human:")) {
      throw new Error("Human Final Authority approval is required.");
    }

    const workspace = this.workspaces.create(blueprint);
    const className = this.workspaces.className(blueprint.name);
    const slug = workspace.slug;

    const base = this.moduleComposer.compose(className, slug);
    const controller = this.controllerGenerator.generate(className, slug);
    const dto = this.dtoGenerator.generate(className, slug);
    const validation = this.validationGenerator.generate(className, slug);
    const unitTest = this.unitTestGenerator.generate(className, slug);
    const integrationTest = this.integrationTestGenerator.generate(
      className,
      slug
    );

    const moduleContent = [
      'import { Module } from "@nestjs/common";',
      `import { ${base.serviceClassName} } from "./${slug}.service";`,
      `import { ${controller.className} } from "./${slug}.controller";`,
      "",
      "@Module({",
      `  controllers: [${controller.className}],`,
      `  providers: [${base.serviceClassName}],`,
      `  exports: [${base.serviceClassName}]`,
      "})",
      `export class ${base.moduleClassName} {}`
    ].join("\n");

    const artifacts = this.writer.writeMany([
      {
        workspacePath: workspace.workspacePath,
        relativePath: `src/${slug}.service.ts`,
        content: base.serviceFile,
        kind: "service"
      },
      {
        workspacePath: workspace.workspacePath,
        relativePath: `src/${slug}.module.ts`,
        content: moduleContent,
        kind: "module"
      },
      {
        workspacePath: workspace.workspacePath,
        relativePath: `src/${controller.fileName}`,
        content: controller.content,
        kind: "controller"
      },
      {
        workspacePath: workspace.workspacePath,
        relativePath: `src/dto/${dto.createFileName}`,
        content: dto.createContent,
        kind: "create-dto"
      },
      {
        workspacePath: workspace.workspacePath,
        relativePath: `src/dto/${dto.updateFileName}`,
        content: dto.updateContent,
        kind: "update-dto"
      },
      {
        workspacePath: workspace.workspacePath,
        relativePath: `src/${validation.fileName}`,
        content: validation.content,
        kind: "validator"
      },
      {
        workspacePath: workspace.workspacePath,
        relativePath: `test/${unitTest.fileName}`,
        content: unitTest.content,
        kind: "unit-test"
      },
      {
        workspacePath: workspace.workspacePath,
        relativePath: `test/${integrationTest.fileName}`,
        content: integrationTest.content,
        kind: "integration-test"
      },
      {
        workspacePath: workspace.workspacePath,
        relativePath: "generation.manifest.json",
        content: JSON.stringify(
          {
            blueprint,
            className,
            slug,
            generatedParts: [37, 38, 39, 40, 41, 42],
            humanFinalAuthority: true,
            generatedAt: new Date().toISOString()
          },
          null,
          2
        ),
        kind: "generation-manifest"
      }
    ]);

    const build = this.buildEngine.execute(workspace.workspacePath);

    return {
      success: build.success,
      workspace,
      artifacts,
      build,
      humanFinalAuthority: true
    };
  }

  smoke() {
    const result = this.generate({
      name: "Factory Generated Capability",
      version: "1.0.0",
      description: "AVOS Factory Mega Bundle C smoke capability.",
      domain: "factory",
      approvedBy: "human:khalifa"
    });

    const expectedKinds = [
      "controller",
      "create-dto",
      "update-dto",
      "validator",
      "unit-test",
      "integration-test",
      "generation-manifest"
    ];

    const checks = {
      controllerGenerated: result.artifacts.some(
        (artifact) => artifact.kind === "controller"
      ),
      dtoGenerated: result.artifacts.some(
        (artifact) => artifact.kind === "create-dto"
      ) && result.artifacts.some(
        (artifact) => artifact.kind === "update-dto"
      ),
      validationGenerated: result.artifacts.some(
        (artifact) => artifact.kind === "validator"
      ),
      unitTestGenerated: result.artifacts.some(
        (artifact) => artifact.kind === "unit-test"
      ),
      integrationTestGenerated: result.artifacts.some(
        (artifact) => artifact.kind === "integration-test"
      ),
      buildEngineExecuted: Boolean(result.build.completedAt),
      artifactKindsComplete: expectedKinds.every(
        (kind) => result.artifacts.some(
          (artifact) => artifact.kind === kind
        )
      ),
      humanFinalAuthority: result.humanFinalAuthority
    };

    const success = Object.values(checks).every(Boolean);

    return {
      success,
      score: success ? 100 : 0,
      checks,
      result
    };
  }
}
