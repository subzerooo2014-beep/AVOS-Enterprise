"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenRuntimePerformanceMonitor = void 0;
class CodeGenRuntimePerformanceMonitor {
    measurements = new Map();
    record(name, durationMs) {
        const current = this.measurements.get(name) ??
            [];
        current.push(Math.max(0, durationMs));
        this.measurements.set(name, current);
    }
    async measure(name, operation) {
        const started = performance.now();
        try {
            return await operation();
        }
        finally {
            this.record(name, performance.now() -
                started);
        }
    }
    report() {
        return Array.from(this.measurements.entries())
            .map(([name, values]) => {
            const totalMs = values.reduce((total, value) => total + value, 0);
            return {
                name,
                count: values.length,
                totalMs,
                averageMs: values.length === 0
                    ? 0
                    : totalMs /
                        values.length,
                minimumMs: values.length === 0
                    ? 0
                    : Math.min(...values),
                maximumMs: values.length === 0
                    ? 0
                    : Math.max(...values),
            };
        })
            .sort((left, right) => right.totalMs -
            left.totalMs);
    }
    clear() {
        this.measurements.clear();
    }
}
exports.CodeGenRuntimePerformanceMonitor = CodeGenRuntimePerformanceMonitor;
//# sourceMappingURL=codegen-runtime-performance-monitor.js.map