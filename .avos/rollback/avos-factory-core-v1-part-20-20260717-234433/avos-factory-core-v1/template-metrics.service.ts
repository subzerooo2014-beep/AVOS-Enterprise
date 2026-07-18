import { Injectable } from "@nestjs/common";
import {
  TemplateMetricsSnapshot,
  TemplateValidationResult
} from "./template.contracts";
import {
  TemplateHistoryService
} from "./template-history.service";
import {
  TemplateRegistryService
} from "./template-registry.service";

@Injectable()
export class TemplateMetricsService {
  private validationRuns = 0;
  private successfulValidations = 0;
  private failedValidations = 0;
  private renderRuns = 0;
  private successfulRenders = 0;
  private failedRenders = 0;
  private composedTemplates = 0;
  private unresolvedVariables = 0;
  private totalRenderDurationMs = 0;

  constructor(
    private readonly registry:
      TemplateRegistryService,
    private readonly history:
      TemplateHistoryService
  ) {}

  recordValidation(
    validation:
      TemplateValidationResult
  ): void {
    this.validationRuns += 1;

    if (validation.valid) {
      this.successfulValidations += 1;
    } else {
      this.failedValidations += 1;
    }
  }

  recordRender(
    success: boolean,
    durationMs: number,
    unresolvedCount: number
  ): void {
    this.renderRuns += 1;
    this.totalRenderDurationMs +=
      durationMs;
    this.unresolvedVariables +=
      unresolvedCount;

    if (success) {
      this.successfulRenders += 1;
    } else {
      this.failedRenders += 1;
    }
  }

  recordComposition(): void {
    this.composedTemplates += 1;
  }

  snapshot():
    TemplateMetricsSnapshot {
    return {
      registeredTemplates:
        this.registry.countTemplates(),
      totalVersions:
        this.registry.countVersions(),
      validationRuns:
        this.validationRuns,
      successfulValidations:
        this.successfulValidations,
      failedValidations:
        this.failedValidations,
      renderRuns:
        this.renderRuns,
      successfulRenders:
        this.successfulRenders,
      failedRenders:
        this.failedRenders,
      composedTemplates:
        this.composedTemplates,
      unresolvedVariables:
        this.unresolvedVariables,
      historyRecords:
        this.history.count(),
      averageRenderDurationMs:
        this.renderRuns === 0
          ? 0
          : Math.round(
              this.totalRenderDurationMs /
              this.renderRuns
            ),
      calculatedAt:
        new Date().toISOString()
    };
  }
}
