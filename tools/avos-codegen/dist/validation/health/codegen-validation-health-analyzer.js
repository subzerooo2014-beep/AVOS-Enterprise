"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenValidationHealthAnalyzer = void 0;
const codegen_validation_contracts_1 = require("../contracts/codegen-validation.contracts");
class CodeGenValidationHealthAnalyzer {
    analyze(issues) {
        const critical = issues.filter((issue) => issue.severity ===
            codegen_validation_contracts_1.CodeGenValidationSeverity.CRITICAL).length;
        const errors = issues.filter((issue) => issue.severity ===
            codegen_validation_contracts_1.CodeGenValidationSeverity.ERROR).length;
        const warnings = issues.filter((issue) => issue.severity ===
            codegen_validation_contracts_1.CodeGenValidationSeverity.WARNING).length;
        return {
            status: critical > 0
                ? "unhealthy"
                : errors > 0
                    ? "degraded"
                    : "healthy",
            errors,
            warnings,
            critical,
            checkedAt: new Date().toISOString(),
        };
    }
}
exports.CodeGenValidationHealthAnalyzer = CodeGenValidationHealthAnalyzer;
//# sourceMappingURL=codegen-validation-health-analyzer.js.map