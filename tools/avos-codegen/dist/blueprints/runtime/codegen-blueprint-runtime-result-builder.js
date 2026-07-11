"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenBlueprintRuntimeResultBuilder = void 0;
class CodeGenBlueprintRuntimeResultBuilder {
    build(execution) {
        const renderedTemplates = execution.templates
            .map((template) => template.rendered)
            .filter((rendered) => Boolean(rendered));
        return {
            success: execution.errors.length ===
                0,
            execution: structuredClone(execution),
            artifacts: structuredClone(execution.artifacts),
            renderedTemplates: structuredClone(renderedTemplates),
            warnings: [...execution.warnings],
            errors: [...execution.errors],
        };
    }
}
exports.CodeGenBlueprintRuntimeResultBuilder = CodeGenBlueprintRuntimeResultBuilder;
//# sourceMappingURL=codegen-blueprint-runtime-result-builder.js.map