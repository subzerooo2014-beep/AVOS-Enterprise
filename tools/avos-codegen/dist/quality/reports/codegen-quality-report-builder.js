"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenQualityReportBuilder = void 0;
const codegen_quality_contracts_1 = require("../contracts/codegen-quality.contracts");
class CodeGenQualityReportBuilder {
    build(input) {
        const completedAt = new Date().toISOString();
        const issues = input.results.flatMap((result) => result.issues);
        const errors = issues.filter((issue) => issue.severity ===
            codegen_quality_contracts_1.CodeGenQualitySeverity.ERROR ||
            issue.severity ===
                codegen_quality_contracts_1.CodeGenQualitySeverity.CRITICAL).length;
        const warnings = issues.filter((issue) => issue.severity ===
            codegen_quality_contracts_1.CodeGenQualitySeverity.WARNING).length;
        const informational = issues.filter((issue) => issue.severity ===
            codegen_quality_contracts_1.CodeGenQualitySeverity.INFORMATIONAL).length;
        const maximumPenalty = Math.max(1, input.results.length *
            10);
        const penalty = errors * 10 +
            warnings * 3 +
            informational;
        return {
            success: errors === 0,
            artifacts: input.artifacts,
            rules: input.results.length,
            passedRules: input.results.filter((result) => result.valid).length,
            failedRules: input.results.filter((result) => !result.valid).length,
            issues,
            errors,
            warnings,
            informational,
            score: Math.max(0, Math.round(100 -
                penalty /
                    maximumPenalty *
                    100)),
            metadata: structuredClone(input.metadata ?? {}),
            startedAt: input.startedAt,
            completedAt,
            durationMs: Date.parse(completedAt) -
                Date.parse(input.startedAt),
        };
    }
}
exports.CodeGenQualityReportBuilder = CodeGenQualityReportBuilder;
//# sourceMappingURL=codegen-quality-report-builder.js.map