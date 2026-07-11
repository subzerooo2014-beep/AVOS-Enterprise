import {
  SystemGenerationRequest,
  SystemGenerationResult,
  SystemGenerationStatus,
} from "./contracts";
import {
  SystemGenerationValidator,
} from "./validator";
import {
  SystemGenerationPlanBuilder,
} from "./plan-builder";
import {
  SystemGenerationGenerator,
} from "./generator";
import {
  SystemGenerationVerifier,
} from "./verifier";

export class SystemGenerationOrchestrator {
  constructor(
    readonly validator:
      SystemGenerationValidator,
    readonly plans:
      SystemGenerationPlanBuilder,
    readonly generator:
      SystemGenerationGenerator,
    readonly verifier:
      SystemGenerationVerifier,
  ) {}

  execute(
    request:
      SystemGenerationRequest,
  ): SystemGenerationResult {
    const startedAt =
      new Date().toISOString();

    const warnings: string[] = [];
    const errors: string[] = [];

    const validation =
      this.validator.validate(
        request,
      );

    if (!validation.valid) {
      errors.push(
        ...validation.issues
          .filter(
            (issue) =>
              issue.blocking,
          )
          .map(
            (issue) =>
              issue.message,
          ),
      );

      return this.result(
        request,
        validation,
        [],
        warnings,
        errors,
        startedAt,
        SystemGenerationStatus.FAILED,
      );
    }

    try {
      const plan =
        this.plans.build(
          request,
        );

      const artifacts =
        this.generator.generate(
          request,
          plan,
        );

      const verification =
        this.verifier.verify(
          request,
          artifacts,
        );

      if (!verification.success) {
        errors.push(
          "Generated system verification failed.",
        );
      }

      const completedAt =
        new Date().toISOString();

      return {
        success:
          verification.success,
        status:
          verification.success
            ? SystemGenerationStatus.COMPLETED
            : SystemGenerationStatus.FAILED,
        request,
        validation,
        plan,
        artifacts,
        verification,
        warnings,
        errors,
        startedAt,
        completedAt,
        durationMs:
          Date.parse(
            completedAt,
          ) -
          Date.parse(
            startedAt,
          ),
      };
    } catch (error) {
      errors.push(
        error instanceof Error
          ? error.message
          : String(error),
      );

      return this.result(
        request,
        validation,
        [],
        warnings,
        errors,
        startedAt,
        SystemGenerationStatus.FAILED,
      );
    }
  }

  private result(
    request:
      SystemGenerationRequest,
    validation:
      SystemGenerationResult["validation"],
    artifacts:
      SystemGenerationResult["artifacts"],
    warnings: string[],
    errors: string[],
    startedAt: string,
    status:
      SystemGenerationStatus,
  ): SystemGenerationResult {
    const completedAt =
      new Date().toISOString();

    return {
      success: false,
      status,
      request,
      validation,
      artifacts,
      warnings,
      errors,
      startedAt,
      completedAt,
      durationMs:
        Date.parse(
          completedAt,
        ) -
        Date.parse(
          startedAt,
        ),
    };
  }
}
