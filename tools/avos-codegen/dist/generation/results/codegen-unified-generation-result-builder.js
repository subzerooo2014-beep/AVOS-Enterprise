"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenUnifiedGenerationResultBuilder = void 0;
class CodeGenUnifiedGenerationResultBuilder {
    build(input) {
        const completedAt = new Date().toISOString();
        return {
            success: input.success,
            mode: input.mode,
            key: input.key,
            artifacts: structuredClone(input.artifacts),
            ...(input.manifest
                ? {
                    manifest: structuredClone(input.manifest),
                }
                : {}),
            ...(input.report
                ? {
                    report: structuredClone(input.report),
                }
                : {}),
            warnings: [...(input.warnings ?? [])],
            errors: [...(input.errors ?? [])],
            startedAt: input.startedAt,
            completedAt,
            durationMs: Date.parse(completedAt) -
                Date.parse(input.startedAt),
        };
    }
}
exports.CodeGenUnifiedGenerationResultBuilder = CodeGenUnifiedGenerationResultBuilder;
//# sourceMappingURL=codegen-unified-generation-result-builder.js.map