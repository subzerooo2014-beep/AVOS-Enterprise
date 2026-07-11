import {
  CodeGenBlueprintExecutionOrchestrator,
} from "../blueprints/runtime/codegen-blueprint-execution-orchestrator";
import {
  CodeGenGeneratorAdapter,
} from "../adapters/generators/codegen-generator-adapter";
import {
  CodeGenGeneratorRegistry,
} from "../generators/codegen-generator-registry";
import {
  EnterpriseModuleV2Generator,
} from "../generators/enterprise-v2/enterprise-module-v2.generator";
import {
  CodeGenOutputCoordinator,
} from "../output/codegen-output-coordinator";
import {
  CodeGenTemplateArtifactPipeline,
} from "./pipelines/codegen-template-artifact-pipeline";
import {
  CodeGenUnifiedGenerationMode,
  CodeGenUnifiedGenerationRequest,
} from "./requests/codegen-unified-generation.contracts";
import {
  CodeGenUnifiedGenerationResultBuilder,
} from "./results/codegen-unified-generation-result-builder";

export class CodeGenUnifiedGenerationService {
  constructor(
    readonly blueprint =
      new CodeGenBlueprintExecutionOrchestrator(),
    readonly generatorRegistry =
      new CodeGenGeneratorRegistry(),
    readonly generatorAdapter =
      new CodeGenGeneratorAdapter(),
    readonly templatePipeline =
      new CodeGenTemplateArtifactPipeline(),
    readonly output =
      new CodeGenOutputCoordinator(),
    readonly results =
      new CodeGenUnifiedGenerationResultBuilder(),
  ) {
    const hasEnterpriseV2 =
      this.generatorRegistry
        .list()
        .some(
          (generator) =>
            generator.descriptor.key ===
            "enterprise-module-v2",
        );

    if (!hasEnterpriseV2) {
      this.generatorRegistry.register(
        new EnterpriseModuleV2Generator(),
      );
    }

    this.generatorAdapter.engine
      .registry.clear();

    for (
      const generator of
      this.generatorRegistry.list()
    ) {
      this.generatorAdapter.engine
        .registry.register(
          generator,
        );
    }
  }

  async execute(
    request:
      CodeGenUnifiedGenerationRequest,
  ) {
    const startedAt =
      new Date().toISOString();

    if (
      request.mode ===
      CodeGenUnifiedGenerationMode.BLUEPRINT
    ) {
      const result =
        await this.blueprint.execute({
          blueprintKey:
            request.key,
          workspaceRoot:
            request.workspaceRoot,
          targetRoot:
            request.targetRoot,
          variables:
            request.variables,
          dryRun:
            request.dryRun,
          strict:
            request.strict,
          conflictPolicy:
            request.conflictPolicy,
          ...(request.metadata
            ? {
                metadata:
                  request.metadata,
              }
            : {}),
        });

      return this.results.build({
        success:
          result.success,
        mode:
          request.mode,
        key:
          request.key,
        artifacts:
          result.runtime.artifacts,
        ...(result.output
          ? {
              manifest:
                result.output.manifest,
              report:
                result.output.report,
            }
          : {}),
        warnings:
          result.runtime.warnings,
        errors:
          result.runtime.errors,
        startedAt,
      });
    }

    if (
      request.mode ===
      CodeGenUnifiedGenerationMode.GENERATOR
    ) {
      const adapted =
        await this.generatorAdapter.execute({
          generatorKey:
            request.key,
          context: {
            workspaceRoot:
              request.workspaceRoot,
            targetRoot:
              request.targetRoot,
            variables:
              request.variables,
            dryRun: true,
            metadata:
              request.metadata ?? {},
          },
        });

      const output =
        await this.output.execute({
          sessionId:
            `generator:${request.key}:${Date.now()}`,
          workspaceRoot:
            request.workspaceRoot,
          targetRoot:
            request.targetRoot,
          artifacts:
            adapted.artifacts,
          dryRun:
            request.dryRun,
          conflictPolicy:
            request.conflictPolicy,
        });

      return this.results.build({
        success:
          output.report.success,
        mode:
          request.mode,
        key:
          request.key,
        artifacts:
          adapted.artifacts,
        manifest:
          output.manifest,
        report:
          output.report,
        warnings:
          adapted.warnings,
        errors:
          output.report.errors,
        startedAt,
      });
    }

    const artifacts =
      this.templatePipeline.execute({
        templateKeys: [
          request.key,
        ],
        variables:
          request.variables,
        strict:
          request.strict,
        ...(request.metadata
          ? {
              metadata:
                request.metadata,
            }
          : {}),
      });

    const output =
      await this.output.execute({
        sessionId:
          `template:${request.key}:${Date.now()}`,
        workspaceRoot:
          request.workspaceRoot,
        targetRoot:
          request.targetRoot,
        artifacts,
        dryRun:
          request.dryRun,
        conflictPolicy:
          request.conflictPolicy,
      });

    return this.results.build({
      success:
        output.report.success,
      mode:
        request.mode,
      key:
        request.key,
      artifacts,
      manifest:
        output.manifest,
      report:
        output.report,
      warnings:
        output.report.warnings,
      errors:
        output.report.errors,
      startedAt,
    });
  }
}
