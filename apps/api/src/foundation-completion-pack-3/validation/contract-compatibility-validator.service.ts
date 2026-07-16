import { Injectable } from "@nestjs/common";
import {
  CompatibilityIssue,
  CompatibilityResult,
  MetadataSchemaDefinition
} from "../foundation-pack-3.types";

@Injectable()
export class ContractCompatibilityValidatorService {
  validateSchemas(
    previous: MetadataSchemaDefinition,
    next: MetadataSchemaDefinition
  ): CompatibilityResult {
    const issues: CompatibilityIssue[] = [];

    const previousFields = new Map(
      previous.fields.map((field) => [field.name, field])
    );
    const nextFields = new Map(next.fields.map((field) => [field.name, field]));

    for (const [name, previousField] of previousFields.entries()) {
      const nextField = nextFields.get(name);

      if (!nextField) {
        issues.push({
          code: "FIELD_REMOVED",
          severity: previousField.required ? "error" : "warning",
          message: `Field removed: ${name}`,
          field: name
        });
        continue;
      }

      if (previousField.type !== nextField.type) {
        issues.push({
          code: "FIELD_TYPE_CHANGED",
          severity: "error",
          message: `Field type changed from ${previousField.type} to ${nextField.type}`,
          field: name
        });
      }

      if (!previousField.required && nextField.required) {
        issues.push({
          code: "FIELD_NOW_REQUIRED",
          severity: "error",
          message: `Optional field became required: ${name}`,
          field: name
        });
      }
    }

    for (const [name, nextField] of nextFields.entries()) {
      if (!previousFields.has(name) && nextField.required) {
        issues.push({
          code: "NEW_REQUIRED_FIELD",
          severity: "error",
          message: `New required field added: ${name}`,
          field: name
        });
      }
    }

    const breakingChanges = issues.filter(
      (issue) => issue.severity === "error"
    ).length;

    const warnings = issues.filter(
      (issue) => issue.severity === "warning"
    ).length;

    return {
      compatible: breakingChanges === 0,
      breakingChanges,
      warnings,
      issues
    };
  }
}
