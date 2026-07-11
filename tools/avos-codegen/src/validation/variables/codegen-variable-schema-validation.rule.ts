import {
  CodeGenJsonValue,
} from "../../core/codegen.contracts";
import {
  CodeGenValidationCategory,
  CodeGenValidationContext,
  CodeGenValidationRule,
  CodeGenValidationRuleResult,
  CodeGenValidationSeverity,
} from "../contracts/codegen-validation.contracts";

export interface CodeGenVariableSchemaEntry {
  key: string;
  type:
    | "string"
    | "number"
    | "boolean"
    | "object"
    | "array";
  required: boolean;
}

export class CodeGenVariableSchemaValidationRule
  implements CodeGenValidationRule {
  readonly descriptor = {
    key:
      "variable-schema-validation",
    name:
      "Variable Schema Validation",
    description:
      "Validates generation variables against a simple production schema",
    category:
      CodeGenValidationCategory.VARIABLES,
    severity:
      CodeGenValidationSeverity.ERROR,
    enabled:
      true,
    priority:
      30,
    capabilities: [
      "required-variable-validation",
      "variable-type-validation",
    ],
  } as const;

  constructor(
    readonly schema:
      readonly CodeGenVariableSchemaEntry[] = [],
  ) {}

  validate(
    context:
      CodeGenValidationContext,
  ): CodeGenValidationRuleResult {
    const issues:
      CodeGenValidationRuleResult["issues"] =
      [];

    for (
      const entry of
      this.schema
    ) {
      const value =
        context.variables[
          entry.key
        ];

      if (
        entry.required &&
        value === undefined
      ) {
        issues.push({
          code:
            "REQUIRED_VARIABLE_MISSING",
          category:
            this.descriptor.category,
          severity:
            this.descriptor.severity,
          message:
            `Required variable is missing: ${entry.key}`,
          path:
            `variables.${entry.key}`,
        });

        continue;
      }

      if (
        value !== undefined &&
        !this.matchesType(
          value,
          entry.type,
        )
      ) {
        issues.push({
          code:
            "VARIABLE_TYPE_MISMATCH",
          category:
            this.descriptor.category,
          severity:
            this.descriptor.severity,
          message:
            `Variable ${entry.key} must be ${entry.type}`,
          path:
            `variables.${entry.key}`,
        });
      }
    }

    return {
      ruleKey:
        this.descriptor.key,
      valid:
        issues.length === 0,
      issues,
      checkedAt:
        new Date().toISOString(),
    };
  }

  private matchesType(
    value:
      CodeGenJsonValue,
    expected:
      CodeGenVariableSchemaEntry["type"],
  ): boolean {
    if (
      expected === "array"
    ) {
      return Array.isArray(value);
    }

    if (
      expected === "object"
    ) {
      return Boolean(
        value &&
        typeof value ===
          "object" &&
        !Array.isArray(value),
      );
    }

    return typeof value ===
      expected;
  }
}
