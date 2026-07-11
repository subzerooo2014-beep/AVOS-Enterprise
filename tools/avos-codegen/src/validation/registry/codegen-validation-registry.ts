import {
  CodeGenValidationError,
} from "../../core/codegen.errors";
import {
  CodeGenValidationRule,
} from "../contracts/codegen-validation.contracts";

export class CodeGenValidationRegistry {
  private readonly rules =
    new Map<string, CodeGenValidationRule>();

  register(
    rule: CodeGenValidationRule,
    replace = false,
  ): CodeGenValidationRule {
    const key =
      rule.descriptor.key.trim();

    if (!key) {
      throw new CodeGenValidationError(
        "Validation rule key is required",
      );
    }

    if (
      this.rules.has(key) &&
      !replace
    ) {
      throw new CodeGenValidationError(
        `Validation rule already exists: ${key}`,
      );
    }

    this.rules.set(key, rule);

    return rule;
  }

  get(
    key: string,
  ): CodeGenValidationRule {
    const rule =
      this.rules.get(key);

    if (!rule) {
      throw new CodeGenValidationError(
        `Validation rule was not found: ${key}`,
      );
    }

    return rule;
  }

  list():
    readonly CodeGenValidationRule[] {
    return Array.from(
      this.rules.values(),
    )
      .filter(
        (rule) =>
          rule.descriptor.enabled,
      )
      .sort(
        (left, right) =>
          left.descriptor.priority -
          right.descriptor.priority,
      );
  }

  clear(): void {
    this.rules.clear();
  }
}
