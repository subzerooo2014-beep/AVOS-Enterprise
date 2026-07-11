"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenEnterpriseRuntimeHealthMonitor = void 0;
class CodeGenEnterpriseRuntimeHealthMonitor {
    evaluate(diagnostics) {
        const critical = diagnostics.filter((item) => item.severity ===
            "critical").length;
        const errors = diagnostics.filter((item) => item.severity ===
            "error").length;
        const warnings = diagnostics.filter((item) => item.severity ===
            "warning").length;
        return {
            status: critical > 0
                ? "unhealthy"
                : errors > 0 ||
                    warnings > 0
                    ? "degraded"
                    : "healthy",
            diagnostics: diagnostics.length,
            warnings,
            errors,
            critical,
            checkedAt: new Date().toISOString(),
        };
    }
}
exports.CodeGenEnterpriseRuntimeHealthMonitor = CodeGenEnterpriseRuntimeHealthMonitor;
//# sourceMappingURL=codegen-enterprise-runtime-health-monitor.js.map