"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenFinalDiagnosticsAggregator = void 0;
class CodeGenFinalDiagnosticsAggregator {
    aggregate(input) {
        const warnings = input.diagnostics.filter((item) => item.severity ===
            "warning");
        const errors = input.diagnostics.filter((item) => item.severity ===
            "error" ||
            item.severity ===
                "critical");
        const failedChecks = input.checks.filter((check) => !check.passed);
        return {
            success: errors.length === 0 &&
                failedChecks.length === 0,
            warnings: warnings.map((item) => item.message),
            errors: [
                ...errors.map((item) => item.message),
                ...failedChecks.map((check) => check.message),
            ],
            diagnostics: structuredClone([...input.diagnostics]),
            checks: structuredClone([...input.checks]),
            generatedAt: new Date().toISOString(),
        };
    }
}
exports.CodeGenFinalDiagnosticsAggregator = CodeGenFinalDiagnosticsAggregator;
//# sourceMappingURL=codegen-final-diagnostics-aggregator.js.map