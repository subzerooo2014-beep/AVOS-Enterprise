import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import { join } from "path";
import {
  CodeGenerationProviderContext,
  CodeGenerationRequest,
  GeneratedArtifact,
  GenerationExecutionRecord,
  GenerationExecutionResult
} from "./code-generation.contracts";
import {
  CodeGenerationProviderRegistryService
} from "./code-generation-provider-registry.service";
import {
  CodeGenerationValidationService
} from "./code-generation-validation.service";
import {
  GenerationHistoryService
} from "./generation-history.service";
import {
  GenerationMetricsService
} from "./generation-metrics.service";
import {
  GenerationOutputManagerService
} from "./generation-output-manager.service";

@Injectable()
export class CodeGenerationEngineService {
  private readonly defaultOutputRoot =
    join(
      process.cwd(),
      ".avos",
      "generated"
    );

  constructor(
    private readonly providers:
      CodeGenerationProviderRegistryService,
    private readonly validation:
      CodeGenerationValidationService,
    private readonly output:
      GenerationOutputManagerService,
    private readonly history:
      GenerationHistoryService,
    private readonly metrics:
      GenerationMetricsService
  ) {}

  async execute(
    request: CodeGenerationRequest
  ): Promise<GenerationExecutionResult> {
    const generationId =
      request.id ?? randomUUID();

    const startedAt =
      new Date().toISOString();

    const start =
      Date.now();

    const artifacts:
      GeneratedArtifact[] = [];

    let warnings: string[] = [];

    try {
      const validation =
        this.validation.validate(request);

      warnings =
        validation.warnings.map(
          (issue) => issue.message
        );

      this.validation.assertValid(
        validation
      );

      const provider =
        this.providers.resolve(
          request.providerId,
          request.target
        );

      const context:
        CodeGenerationProviderContext = {
        generationId,
        blueprintId:
          request.blueprintId,
        blueprintVersion:
          request.blueprintVersion,
        stepId: request.stepId,
        target: request.target,
        input:
          structuredClone(
            request.input ?? {}
          ),
        variables:
          structuredClone(
            request.variables ?? {}
          ),
        requestedBy:
          request.requestedBy,
        correlationId:
          request.correlationId
      };

      const providerResult =
        await provider.generate(
          context
        );

      warnings = [
        ...warnings,
        ...(providerResult.warnings ?? [])
      ];

      if (!providerResult.success) {
        throw new Error(
          `Generation provider "${provider.id}" returned an unsuccessful result.`
        );
      }

      const outputRoot =
        request.outputPath
          ? join(
              this.defaultOutputRoot,
              request.outputPath
            )
          : this.defaultOutputRoot;

      for (
        const generated
        of providerResult.artifacts
      ) {
        artifacts.push(
          this.output.createArtifact({
            generationId,
            relativePath:
              generated.path,
            content:
              generated.content,
            type:
              generated.type,
            outputRoot,
            dryRun:
              request.dryRun === true,
            overwrite:
              request.overwrite === true
          })
        );
      }

      const completedAt =
        new Date().toISOString();

      const durationMs =
        Date.now() - start;

      const record:
        GenerationExecutionRecord = {
        id: randomUUID(),
        generationId,
        blueprintId:
          request.blueprintId,
        blueprintVersion:
          request.blueprintVersion,
        stepId:
          request.stepId,
        providerId:
          provider.id,
        target:
          request.target,
        status: "completed",
        success: true,
        dryRun:
          request.dryRun === true,
        artifactCount:
          artifacts.length,
        startedAt,
        completedAt,
        durationMs,
        requestedBy:
          request.requestedBy,
        approvedBy:
          request.approvedBy,
        correlationId:
          request.correlationId,
        warnings
      };

      this.history.add(record);

      this.metrics.record(
        record,
        artifacts.filter(
          (artifact) =>
            artifact.written
        ).length
      );

      return {
        success: true,
        generationId,
        status: "completed",
        providerId:
          provider.id,
        target:
          request.target,
        dryRun:
          request.dryRun === true,
        artifacts,
        warnings,
        startedAt,
        completedAt,
        durationMs
      };
    } catch (error) {
      let rolledBack = false;

      if (
        artifacts.some(
          (artifact) =>
            artifact.written
        )
      ) {
        this.output.rollback(
          artifacts
        );

        rolledBack = true;
      }

      const completedAt =
        new Date().toISOString();

      const durationMs =
        Date.now() - start;

      const message =
        error instanceof Error
          ? error.message
          : "Unknown generation error.";

      const record:
        GenerationExecutionRecord = {
        id: randomUUID(),
        generationId,
        blueprintId:
          request.blueprintId,
        blueprintVersion:
          request.blueprintVersion,
        stepId:
          request.stepId,
        providerId:
          request.providerId,
        target:
          request.target,
        status:
          rolledBack
            ? "rolled-back"
            : "failed",
        success: false,
        dryRun:
          request.dryRun === true,
        artifactCount:
          artifacts.length,
        startedAt,
        completedAt,
        durationMs,
        requestedBy:
          request.requestedBy,
        approvedBy:
          request.approvedBy,
        correlationId:
          request.correlationId,
        error: message,
        warnings
      };

      this.history.add(record);

      this.metrics.record(
        record,
        0
      );

      return {
        success: false,
        generationId,
        status:
          rolledBack
            ? "rolled-back"
            : "failed",
        providerId:
          request.providerId,
        target:
          request.target,
        dryRun:
          request.dryRun === true,
        artifacts,
        warnings,
        startedAt,
        completedAt,
        durationMs,
        error: message
      };
    }
  }
}
