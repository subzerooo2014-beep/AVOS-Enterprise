import {
  CodeGenTemplateDiagnostic,
} from "../contracts/codegen-template-v2.contracts";

export class CodeGenTemplateDiagnosticsFormatterV2 {
  format(
    diagnostics:
      readonly CodeGenTemplateDiagnostic[],
  ): string {
    if (
      diagnostics.length ===
      0
    ) {
      return "No template diagnostics.";
    }

    return diagnostics
      .map(
        (
          diagnostic,
          index,
        ) => {
          const location =
            diagnostic.line !==
              undefined &&
            diagnostic.column !==
              undefined
              ? ` at ${diagnostic.line}:${diagnostic.column}`
              : "";

          return [
            `${index + 1}. [${diagnostic.severity}] ${diagnostic.code}${location}`,
            `   ${diagnostic.message}`,
            ...(diagnostic.expression
              ? [
                  `   expression: ${diagnostic.expression}`,
                ]
              : []),
          ].join("\n");
        },
      )
      .join("\n");
  }
}
