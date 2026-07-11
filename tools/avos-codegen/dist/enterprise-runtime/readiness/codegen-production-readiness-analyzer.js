"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenProductionReadinessAnalyzer = void 0;
class CodeGenProductionReadinessAnalyzer {
    analyze(checks) {
        const passed = checks.filter((check) => check.passed).length;
        const failed = checks.length -
            passed;
        const criticalFailures = checks.filter((check) => !check.passed &&
            check.critical).length;
        const score = checks.length === 0
            ? 100
            : Math.round(passed /
                checks.length *
                100);
        return {
            ready: failed === 0 &&
                criticalFailures === 0,
            checks: structuredClone([...checks]),
            passed,
            failed,
            criticalFailures,
            score,
            generatedAt: new Date().toISOString(),
        };
    }
}
exports.CodeGenProductionReadinessAnalyzer = CodeGenProductionReadinessAnalyzer;
//# sourceMappingURL=codegen-production-readiness-analyzer.js.map