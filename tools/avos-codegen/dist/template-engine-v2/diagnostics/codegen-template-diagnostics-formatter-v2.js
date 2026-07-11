"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenTemplateDiagnosticsFormatterV2 = void 0;
class CodeGenTemplateDiagnosticsFormatterV2 {
    format(diagnostics) {
        if (diagnostics.length ===
            0) {
            return "No template diagnostics.";
        }
        return diagnostics
            .map((diagnostic, index) => {
            const location = diagnostic.line !==
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
        })
            .join("\n");
    }
}
exports.CodeGenTemplateDiagnosticsFormatterV2 = CodeGenTemplateDiagnosticsFormatterV2;
//# sourceMappingURL=codegen-template-diagnostics-formatter-v2.js.map