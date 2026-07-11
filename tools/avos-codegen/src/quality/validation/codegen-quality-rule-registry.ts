import {
  CodeGenValidationError,
} from "../../core/codegen.errors";
import {
  CodeGenQualityRule,
} from "../contracts/codegen-quality.contracts";

export class CodeGenQualityRuleRegistry {
  private readonly rules =
    new Map<string, CodeGenQualityRule>();

  register(
    rule: CodeGenQualityRule,
    replace = false,
  ): CodeGenQualityRule {
    const key =
      rule.descriptor.key.trim();

    if (!key) {
      throw new CodeGenValidationError(
        "Quality rule key is required",
      );
    }

    if (
      this.rules.has(key) &&
      !replace
    ) {
      throw new CodeGenValidationError(
        `Quality rule already exists: ${key}`,
      );
    }

    this.rules.set(
      key,
      rule,
    );

    return rule;
  }

  get(
    key: string,
  ): CodeGenQualityRule {
    const rule =
      this.rules.get(key);

    if (!rule) {
      throw new CodeGenValidationError(
        `Quality rule was not found: ${key}`,
      );
    }

    return rule;
  }

  list():
    readonly CodeGenQualityRule[] {
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
