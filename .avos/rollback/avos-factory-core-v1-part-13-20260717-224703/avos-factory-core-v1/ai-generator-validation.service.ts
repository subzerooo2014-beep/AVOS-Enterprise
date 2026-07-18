import {
  BadRequestException,
  Injectable
} from "@nestjs/common";
import {
  AiGenerationRequest
} from "./ai-generator.contracts";

@Injectable()
export class AiGeneratorValidationService {
  validate(
    request: AiGenerationRequest
  ): {
    valid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (
      !request.prompt ||
      request.prompt.trim().length < 5
    ) {
      errors.push(
        "prompt must contain at least 5 characters."
      );
    }

    if (
      !request.requestedBy ||
      request.requestedBy.trim().length === 0
    ) {
      errors.push(
        "requestedBy is required."
      );
    }

    if (
      request.overwrite === true &&
      request.humanApproved !== true
    ) {
      errors.push(
        "overwrite requires Human Final Authority approval."
      );
    }

    if (
      request.humanApproved === true &&
      (
        !request.approvedBy ||
        request.approvedBy.trim().length === 0
      )
    ) {
      errors.push(
        "approvedBy is required when humanApproved is true."
      );
    }

    if (
      request.outputPath &&
      this.isUnsafePath(request.outputPath)
    ) {
      errors.push(
        "outputPath cannot escape the configured generation root."
      );
    }

    if (request.dryRun === true) {
      warnings.push(
        "Dry-run mode is enabled."
      );
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  assertValid(
    result: {
      valid: boolean;
      errors: string[];
      warnings: string[];
    }
  ): void {
    if (result.valid) {
      return;
    }

    throw new BadRequestException({
      message:
        "AVOS AI Generator validation failed.",
      errors: result.errors,
      warnings: result.warnings
    });
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
