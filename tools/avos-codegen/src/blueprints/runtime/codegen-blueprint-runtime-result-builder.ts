import {
  CodeGenBlueprintRuntimeExecution,
  CodeGenBlueprintRuntimeResult,
} from "./codegen-blueprint-runtime.contracts";

export class CodeGenBlueprintRuntimeResultBuilder {
  build(
    execution:
      CodeGenBlueprintRuntimeExecution,
  ): CodeGenBlueprintRuntimeResult {
    const renderedTemplates =
      execution.templates
        .map(
          (template) =>
            template.rendered,
        )
        .filter(
          (
            rendered,
          ): rendered is NonNullable<
            typeof rendered
          > =>
            Boolean(rendered),
        );

    return {
      success:
        execution.errors.length ===
        0,
      execution:
        structuredClone(
          execution,
        ),
      artifacts:
        structuredClone(
          execution.artifacts,
        ),
      renderedTemplates:
        structuredClone(
          renderedTemplates,
        ),
      warnings:
        [...execution.warnings],
      errors:
        [...execution.errors],
    };
  }
}
