import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  AvosTemplate,
  TemplateCompositionRequest,
  TemplateRenderRequest,
  TemplateRenderResult,
  TemplateValidationResult
} from "./template.contracts";
import {
  TemplateCompositionService
} from "./template-composition.service";
import {
  TemplateHistoryService
} from "./template-history.service";
import {
  TemplateMetricsService
} from "./template-metrics.service";
import {
  TemplateRegistryService
} from "./template-registry.service";
import {
  TemplateRendererService
} from "./template-renderer.service";
import {
  TemplateValidationService
} from "./template-validation.service";

@Injectable()
export class TemplateEngineService {
  constructor(
    private readonly registry:
      TemplateRegistryService,
    private readonly validation:
      TemplateValidationService,
    private readonly renderer:
      TemplateRendererService,
    private readonly composition:
      TemplateCompositionService,
    private readonly history:
      TemplateHistoryService,
    private readonly metrics:
      TemplateMetricsService
  ) {}

  register(
    template: AvosTemplate
  ): AvosTemplate {
    const validation =
      this.validation.validate(template);

    this.metrics.recordValidation(
      validation
    );

    this.history.record({
      action: "validated",
      templateId:
        template.id ?? "unknown",
      templateVersion:
        template.version ?? "unknown",
      success: validation.valid,
      details: {
        errors: validation.errors,
        warnings: validation.warnings
      }
    });

    this.validation.assertValid(
      validation
    );

    const registered =
      this.registry.register(template);

    this.history.record({
      action: "registered",
      templateId:
        registered.id,
      templateVersion:
        registered.version,
      success: true,
      details: {
        format: registered.format,
        status: registered.status
      }
    });

    return registered;
  }

  validate(
    template: AvosTemplate
  ): TemplateValidationResult {
    const validation =
      this.validation.validate(template);

    this.metrics.recordValidation(
      validation
    );

    return validation;
  }

  render(
    request: TemplateRenderRequest
  ): TemplateRenderResult {
    const start = Date.now();
    const renderId = randomUUID();

    try {
      const template =
        this.registry.get(
          request.templateId,
          request.version
        );

      if (
        template.status === "archived"
      ) {
        throw new Error(
          `Template "${template.id}" is archived.`
        );
      }

      const rendered =
        this.renderer.render(
          template,
          request.variables ?? {},
          request.strict !== false
        );

      const durationMs =
        Date.now() - start;

      this.metrics.recordRender(
        true,
        durationMs,
        rendered.unresolvedVariables.length
      );

      this.history.record({
        action: "rendered",
        templateId:
          template.id,
        templateVersion:
          template.version,
        success: true,
        details: {
          renderId,
          requestedBy:
            request.requestedBy,
          approvedBy:
            request.approvedBy,
          humanApproved:
            request.humanApproved,
          correlationId:
            request.correlationId,
          durationMs,
          unresolvedVariables:
            rendered.unresolvedVariables
        }
      });

      return {
        success: true,
        renderId,
        templateId:
          template.id,
        templateVersion:
          template.version,
        content:
          rendered.content,
        format:
          template.format,
        resolvedVariables:
          rendered.resolvedVariables,
        unresolvedVariables:
          rendered.unresolvedVariables,
        warnings:
          rendered.warnings,
        renderedAt:
          new Date().toISOString(),
        durationMs
      };
    } catch (error) {
      const durationMs =
        Date.now() - start;

      this.metrics.recordRender(
        false,
        durationMs,
        0
      );

      this.history.record({
        action: "rendered",
        templateId:
          request.templateId,
        templateVersion:
          request.version ?? "latest",
        success: false,
        details: {
          renderId,
          requestedBy:
            request.requestedBy,
          error:
            error instanceof Error
              ? error.message
              : "Unknown render error."
        }
      });

      throw error;
    }
  }

  composeAndRegister(
    request: TemplateCompositionRequest
  ): AvosTemplate {
    const composed =
      this.composition.compose(request);

    const registered =
      this.register(composed);

    this.metrics.recordComposition();

    this.history.record({
      action: "composed",
      templateId:
        registered.id,
      templateVersion:
        registered.version,
      success: true,
      details: {
        partialTemplateIds:
          request.partialTemplateIds
      }
    });

    return registered;
  }

  list(): AvosTemplate[] {
    return this.registry.list();
  }

  get(
    templateId: string,
    version?: string
  ): AvosTemplate {
    return this.registry.get(
      templateId,
      version
    );
  }

  archive(
    templateId: string,
    version?: string
  ): AvosTemplate {
    const archived =
      this.registry.archive(
        templateId,
        version
      );

    this.history.record({
      action: "archived",
      templateId:
        archived.id,
      templateVersion:
        archived.version,
      success: true
    });

    return archived;
  }
}
