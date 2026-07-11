"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenExecutionMetricsCollector = void 0;
class CodeGenExecutionMetricsCollector {
    metrics = new Map();
    increment(key) {
        this.metrics.set(key, (this.metrics.get(key) ?? 0) + 1);
    }
    snapshot() {
        return Object.fromEntries(this.metrics);
    }
}
exports.CodeGenExecutionMetricsCollector = CodeGenExecutionMetricsCollector;
//# sourceMappingURL=codegen-execution-metrics-collector.js.map