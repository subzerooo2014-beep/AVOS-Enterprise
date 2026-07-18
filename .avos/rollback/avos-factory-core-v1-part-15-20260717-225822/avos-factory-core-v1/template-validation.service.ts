import {
  BadRequestException,
  Injectable
} from "@nestjs/common";
import {
  AvosTemplate,
  TemplateValidationIssue,
  TemplateValidationResult
} from "./template.contracts";

@Injectable()
export class TemplateValidationService {
  validate(
    template: AvosTemplate
  ): TemplateValidationResult {
    const errors: TemplateValidationIssue[] = [];
    const warnings: TemplateValidationIssue[] = [];

    this.requireText(
      template?.id,
      "id",
      "TEMPLATE_ID_REQUIRED",
      errors
    );

    this.requireText(
      template?.name,
      "name",
      "TEMPLATE_NAME_REQUIRED",
      errors
    );

    if (
      !template?.version ||
      !/^\d+\.\d+\.\d+$/.test(
        template.version
      )
    ) {
      errors.push({
        code: "TEMPLATE_VERSION_INVALID",
        message:
          "Template version must use semantic version format.",
        path: "version",
        severity: "error"
      });
    }

    this.requireText(
      template?.content,
      "content",
      "TEMPLATE_CONTENT_REQUIRED",
      errors
    );

    if (!template?.metadata) {
      errors.push({
        code: "TEMPLATE_METADATA_REQUIRED",
        message:
          "Template metadata is required.",
        path: "metadata",
        severity: "error"
      });
    } else {
      this.requireText(
        template.metadata.createdBy,
        "metadata.createdBy",
        "TEMPLATE_CREATOR_REQUIRED",
        errors
      );

      if (
        !template.metadata.createdAt ||
        Number.isNaN(
          Date.parse(
            template.metadata.createdAt
          )
        )
      ) {
        errors.push({
          code:
            "TEMPLATE_CREATED_AT_INVALID",
          message:
            "metadata.createdAt must be a valid ISO date.",
          path: "metadata.createdAt",
          severity: "error"
        });
      }

      if (
        template.metadata
          .humanFinalAuthority !== true
      ) {
        warnings.push({
          code:
            "TEMPLATE_HUMAN_AUTHORITY_DISABLED",
          message:
            "Human Final Authority should be enabled.",
          path:
            "metadata.humanFinalAuthority",
          severity: "warning"
        });
      }
    }

    const variableNames =
      new Set<string>();

    for (
      const [index, variable]
      of (template?.variables ?? []).entries()
    ) {
      if (
        !variable.name ||
        variable.name.trim().length === 0
      ) {
        errors.push({
          code:
            "TEMPLATE_VARIABLE_NAME_REQUIRED",
          message:
            "Template variable name is required.",
          path:
            `variables[${index}].name`,
          severity: "error"
        });

        continue;
      }

      if (
        variableNames.has(variable.name)
      ) {
        errors.push({
          code:
            "TEMPLATE_VARIABLE_DUPLICATE",
          message:
            `Duplicate template variable "${variable.name}".`,
          path:
            `variables[${index}].name`,
          severity: "error"
        });
      }

      variableNames.add(variable.name);
    }

    const declaredVariables =
      this.extractVariables(
        template?.content ?? ""
      );

    for (
      const variableName
      of declaredVariables
    ) {
      if (
        !variableNames.has(variableName)
      ) {
        warnings.push({
          code:
            "TEMPLATE_VARIABLE_UNDECLARED",
          message:
            `Variable "${variableName}" is used but not declared.`,
          path: "content",
          severity: "warning"
        });
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  assertValid(
    validation:
      TemplateValidationResult
  ): void {
    if (validation.valid) {
      return;
    }

    throw new BadRequestException({
      message:
        "AVOS template validation failed.",
      errors: validation.errors,
      warnings: validation.warnings
    });
  }

  extractVariables(
    content: string
  ): string[] {
    const result =
      new Set<string>();

    const expression =
      /\{\{\s*([A-Za-z_][A-Za-z0-9_.]*)\s*\}\}/g;

    let match:
      RegExpExecArray | null;

    while (
      (match =
        expression.exec(content)) !== null
    ) {
      const name = match[1];

      if (
        name &&
        !name.startsWith("if.") &&
        !name.startsWith("unless.")
      ) {
        result.add(name);
      }
    }

    return [...result];
  }

  private requireText(
    value: string | undefined,
    path: string,
    code: string,
    errors: TemplateValidationIssue[]
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
}
