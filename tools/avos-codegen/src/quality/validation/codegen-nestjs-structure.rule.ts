import {
  CodeGenQualityRule,
  CodeGenQualityRuleCategory,
  CodeGenQualityRuleContext,
  CodeGenQualityRuleResult,
  CodeGenQualitySeverity,
} from "../contracts/codegen-quality.contracts";

export class CodeGenNestJsStructureRule
  implements CodeGenQualityRule {
  readonly descriptor = {
    key:
      "nestjs-structure",
    name:
      "NestJS Structure Rule",
    description:
      "Validates generated NestJS modules, controllers, and services",
    category:
      CodeGenQualityRuleCategory.NESTJS,
    severity:
      CodeGenQualitySeverity.ERROR,
    enabled:
      true,
    priority:
      30,
    capabilities: [
      "module-validation",
      "controller-validation",
      "service-validation",
    ],
  } as const;

  validate(
    context:
      CodeGenQualityRuleContext,
  ): CodeGenQualityRuleResult {
    const path =
      context.artifact.relativePath;

    const content =
      context.artifact.content;

    const issues:
      CodeGenQualityRuleResult["issues"] =
      [];

    if (
      path.endsWith(
        ".module.ts",
      )
    ) {
      if (
        !content.includes(
          "@Module(",
        )
      ) {
        issues.push({
          code:
            "NESTJS_MODULE_DECORATOR_MISSING",
          category:
            this.descriptor.category,
          severity:
            this.descriptor.severity,
          message:
            "NestJS module file must include @Module decorator",
          artifactKey:
            context.artifact.key,
          relativePath:
            path,
        });
      }

      if (
        !content.includes(
          "export class",
        )
      ) {
        issues.push({
          code:
            "NESTJS_MODULE_CLASS_MISSING",
          category:
            this.descriptor.category,
          severity:
            this.descriptor.severity,
          message:
            "NestJS module file must export a class",
          artifactKey:
            context.artifact.key,
          relativePath:
            path,
        });
      }
    }

    if (
      path.endsWith(
        ".controller.ts",
      ) &&
      !content.includes(
        "@Controller(",
      )
    ) {
      issues.push({
        code:
          "NESTJS_CONTROLLER_DECORATOR_MISSING",
        category:
          this.descriptor.category,
        severity:
          this.descriptor.severity,
        message:
          "NestJS controller file must include @Controller decorator",
        artifactKey:
          context.artifact.key,
        relativePath:
          path,
      });
    }

    if (
      path.endsWith(
        ".service.ts",
      ) &&
      !content.includes(
        "@Injectable(",
      ) &&
      !content.includes(
        "@Injectable()",
      )
    ) {
      issues.push({
        code:
          "NESTJS_SERVICE_INJECTABLE_MISSING",
        category:
          this.descriptor.category,
        severity:
          this.descriptor.severity,
        message:
          "NestJS service file must include @Injectable decorator",
        artifactKey:
          context.artifact.key,
        relativePath:
          path,
      });
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
}
