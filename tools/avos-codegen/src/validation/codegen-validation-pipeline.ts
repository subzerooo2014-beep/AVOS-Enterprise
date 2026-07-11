import {
  CodeGenValidationContext,
  CodeGenValidationPipelineResult,
  CodeGenValidationResult,
  CodeGenValidator,
} from "./codegen-validation.contracts";
import {
  CodeGenValidationError,
} from "../core/codegen.errors";

export class CodeGenValidationPipeline {
  private readonly validators =
    new Map<string, CodeGenValidator>();

  register(
    validator: CodeGenValidator,
    replace = false,
  ): CodeGenValidator {
    if (
      this.validators.has(validator.key) &&
      !replace
    ) {
      throw new CodeGenValidationError(
        `Validator already exists: ${validator.key}`,
      );
    }

    this.validators.set(
      validator.key,
      validator,
    );

    return validator;
  }

  get(key: string): CodeGenValidator {
    const validator = this.validators.get(key);

    if (!validator) {
      throw new CodeGenValidationError(
        `Validator was not found: ${key}`,
      );
    }

    return validator;
  }

  list(): readonly CodeGenValidator[] {
    return Array.from(this.validators.values())
      .sort(
        (left, right) =>
          right.priority - left.priority,
      );
  }

  async run(
    context: CodeGenValidationContext,
  ): Promise<CodeGenValidationPipelineResult> {
    const results: CodeGenValidationResult[] = [];

    for (const validator of this.list()) {
      results.push(
        await validator.validate(context),
      );
    }

    const issueCount = results.reduce(
      (total, result) =>
        total + result.issues.length,
      0,
    );

    return {
      valid: results.every((result) => result.valid),
      results,
      issueCount,
      checkedAt: new Date().toISOString(),
    };
  }

  remove(key: string): CodeGenValidator {
    const validator = this.get(key);
    this.validators.delete(key);
    return validator;
  }

  clear(): void {
    this.validators.clear();
  }
}
