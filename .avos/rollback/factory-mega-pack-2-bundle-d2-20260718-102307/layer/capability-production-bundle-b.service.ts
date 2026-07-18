import { Injectable } from "@nestjs/common";
import { CapabilityProductionBlueprint } from "./capability-production-persistence.contracts";
import { CapabilityWorkspaceBuilderService } from "./capability-workspace-builder.service";
import { NestjsModuleComposerService } from "./nestjs-module-composer.service";
import { PhysicalFileWriterService } from "./physical-file-writer.service";

@Injectable()
export class CapabilityProductionBundleBService {
  constructor(
    private readonly workspaces: CapabilityWorkspaceBuilderService,
    private readonly writer: PhysicalFileWriterService,
    private readonly composer: NestjsModuleComposerService
  ) {}

  generateFoundation(
    blueprint: CapabilityProductionBlueprint
  ) {
    if (!blueprint.approvedBy.startsWith("human:")) {
      throw new Error(
        "Human Final Authority approval is required."
      );
    }

    const workspace = this.workspaces.create(blueprint);
    const className = this.workspaces.className(
      blueprint.name
    );
    const composition = this.composer.compose(
      className,
      workspace.slug
    );

    const artifacts = this.writer.writeMany([
      {
        workspacePath: workspace.workspacePath,
        relativePath: `src/${workspace.slug}.service.ts`,
        content: composition.serviceFile,
        kind: "service"
      },
      {
        workspacePath: workspace.workspacePath,
        relativePath: `src/${workspace.slug}.module.ts`,
        content: composition.moduleFile,
        kind: "module"
      },
      {
        workspacePath: workspace.workspacePath,
        relativePath: "capability.workspace.json",
        content: JSON.stringify(
          {
            blueprint,
            workspace,
            moduleClassName:
              composition.moduleClassName,
            serviceClassName:
              composition.serviceClassName,
            humanFinalAuthority: true,
            generatedAt: new Date().toISOString()
          },
          null,
          2
        ),
        kind: "workspace-manifest"
      }
    ]);

    return {
      success: true,
      workspace,
      composition: {
        moduleClassName:
          composition.moduleClassName,
        serviceClassName:
          composition.serviceClassName
      },
      artifacts,
      humanFinalAuthority: true
    };
  }

  smoke() {
    const result = this.generateFoundation({
      name: "Factory Workspace Capability",
      version: "1.0.0",
      description:
        "AVOS Factory Bundle B smoke capability.",
      domain: "factory",
      approvedBy: "human:khalifa"
    });

    const checks = {
      workspaceCreated: Boolean(
        result.workspace.workspacePath
      ),
      sourceDirectoryCreated: Boolean(
        result.workspace.sourcePath
      ),
      serviceGenerated: result.artifacts.some(
        (artifact) => artifact.kind === "service"
      ),
      moduleGenerated: result.artifacts.some(
        (artifact) => artifact.kind === "module"
      ),
      manifestGenerated: result.artifacts.some(
        (artifact) =>
          artifact.kind === "workspace-manifest"
      ),
      humanFinalAuthority:
        result.humanFinalAuthority
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
