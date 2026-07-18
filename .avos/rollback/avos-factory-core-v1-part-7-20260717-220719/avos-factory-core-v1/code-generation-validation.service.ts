import {
  BadRequestException,
  Injectable
} from "@nestjs/common";
import {
  CodeGenerationRequest,
  GenerationValidationIssue,
  GenerationValidationResult
} from "./code-generation.contracts";

@Injectable()
export class CodeGenerationValidationService {
  validate(
    request: CodeGenerationRequest
  ): GenerationValidationResult {
    const errors: GenerationValidationIssue[] = [];
    const warnings: GenerationValidationIssue[] = [];

    this.requireText(
      request.blueprintId,
      "blueprintId",
      "GENERATION_BLUEPRINT_ID_REQUIRED",
      errors
    );

    this.requireText(
      request.blueprintVersion,
      "blueprintVersion",
      "GENERATION_BLUEPRINT_VERSION_REQUIRED",
      errors
    );

    this.requireText(
      request.stepId,
      "stepId",
      "GENERATION_STEP_ID_REQUIRED",
      errors
    );

    this.requireText(
      request.providerId,
      "providerId",
      "GENERATION_PROVIDER_ID_REQUIRED",
      errors
    );

    this.requireText(
      request.target,
      "target",
      "GENERATION_TARGET_REQUIRED",
      errors
    );

    this.requireText(
      request.requestedBy,
      "requestedBy",
      "GENERATION_REQUESTER_REQUIRED",
      errors
    );

    if (
      request.outputPath &&
      this.isUnsafePath(request.outputPath)
    ) {
      errors.push({
        code: "GENERATION_OUTPUT_PATH_UNSAFE",
        message:
          "Output path cannot escape the configured generation root.",
        path: "outputPath",
        severity: "error"
      });
    }

    if (
      request.overwrite === true &&
      request.humanApproved !== true
    ) {
      errors.push({
        code:
          "GENERATION_OVERWRITE_REQUIRES_APPROVAL",
        message:
          "Overwriting generated files requires Human Final Authority approval.",
        path: "humanApproved",
        severity: "error"
      });
    }

    if (
      request.humanApproved === true &&
      (
        !request.approvedBy ||
        request.approvedBy.trim().length === 0
      )
    ) {
      errors.push({
        code:
          "GENERATION_APPROVER_REQUIRED",
        message:
          "approvedBy is required when humanApproved is true.",
        path: "approvedBy",
        severity: "error"
      });
    }

    if (request.dryRun === true) {
      warnings.push({
        code: "GENERATION_DRY_RUN",
        message:
          "Dry-run mode is enabled; generated artifacts will not be written.",
        path: "dryRun",
        severity: "warning"
      });
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  assertValid(
    validation: GenerationValidationResult
  ): void {
    if (validation.valid) {
      return;
    }

    throw new BadRequestException({
      message:
        "AVOS code generation validation failed.",
      errors: validation.errors,
      warnings: validation.warnings
    });
  }

  private requireText(
    value: string | undefined,
    path: string,
    code: string,
    errors: GenerationValidationIssue[]
  ): void {
    if (
      typeof value !== "string" ||
      value.trim().length === 0
    ) {
      errors.push({
        code,
        message: `${path} is required.`,
        path,
        severity: "error"
      });
    }
  }

  private isUnsafePath(
    outputPath: string
  ): boolean {
    const normalized =
      outputPath.replace(/\\/g, "/");

    return (
      normalized.startsWith("/") ||
      /^[A-Za-z]:\//.test(normalized) ||
      normalized
        .split("/")
        .some(
          (segment) =>
            segment === ".."
        )
    );
  }
}
