"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenValidationReportBuilder = void 0;
const codegen_validation_contracts_1 = require("../contracts/codegen-validation.contracts");
class CodeGenValidationReportBuilder {
    build(input) {
        const completedAt = new Date().toISOString();
        const issues = input.results.flatMap((result) => result.issues);
        const critical = issues.filter((issue) => issue.severity ===
            codegen_validation_contracts_1.CodeGenValidationSeverity.CRITICAL).length;
        const errors = issues.filter((issue) => issue.severity ===
            codegen_validation_contracts_1.CodeGenValidationSeverity.ERROR).length;
        const warnings = issues.filter((issue) => issue.severity ===
            codegen_validation_contracts_1.CodeGenValidationSeverity.WARNING).length;
        const penalty = critical * 30 +
            errors * 12 +
            warnings * 3;
        return {
            success: critical === 0 &&
                errors === 0,
            rules: input.results.length,
            passed: input.results.filter((result) => result.valid).length,
            failed: input.results.filter((result) => !result.valid).length,
            issues,
            errors,
            warnings,
            critical,
            score: Math.max(0, 100 - penalty),
            metadata: structuredClone(input.metadata ?? {}),
            startedAt: input.startedAt,
            completedAt,
            durationMs: Date.parse(completedAt) -
                Date.parse(input.startedAt),
        };
    }
}
exports.CodeGenValidationReportBuilder = CodeGenValidationReportBuilder;
//# sourceMappingURL=codegen-validation-report-builder.js.map