import { Injectable } from "@nestjs/common";
import {
  GenerationExecutionRecord,
  GenerationMetricsSnapshot
} from "./code-generation.contracts";
import {
  CodeGenerationProviderRegistryService
} from "./code-generation-provider-registry.service";

@Injectable()
export class GenerationMetricsService {
  private totalExecutions = 0;
  private successfulExecutions = 0;
  private failedExecutions = 0;
  private dryRunExecutions = 0;
  private rolledBackExecutions = 0;
  private generatedArtifacts = 0;
  private writtenArtifacts = 0;
  private totalDurationMs = 0;

  constructor(
    private readonly providers:
      CodeGenerationProviderRegistryService
  ) {}

  record(
    execution: GenerationExecutionRecord,
    writtenArtifacts: number
  ): void {
    this.totalExecutions += 1;
    this.totalDurationMs +=
      execution.durationMs ?? 0;
    this.generatedArtifacts +=
      execution.artifactCount;
    this.writtenArtifacts +=
      writtenArtifacts;

    if (execution.success) {
      this.successfulExecutions += 1;
    } else {
      this.failedExecutions += 1;
    }

    if (execution.dryRun) {
      this.dryRunExecutions += 1;
    }

    if (
      execution.status ===
      "rolled-back"
    ) {
      this.rolledBackExecutions += 1;
    }
  }

  snapshot():
    GenerationMetricsSnapshot {
    return {
      totalExecutions:
        this.totalExecutions,
      successfulExecutions:
        this.successfulExecutions,
      failedExecutions:
        this.failedExecutions,
      dryRunExecutions:
        this.dryRunExecutions,
      rolledBackExecutions:
        this.rolledBackExecutions,
      generatedArtifacts:
        this.generatedArtifacts,
      writtenArtifacts:
        this.writtenArtifacts,
      registeredProviders:
        this.providers.count(),
      averageDurationMs:
        this.totalExecutions === 0
          ? 0
          : Math.round(
              this.totalDurationMs /
              this.totalExecutions
            ),
      calculatedAt:
        new Date().toISOString()
    };
  }
}
