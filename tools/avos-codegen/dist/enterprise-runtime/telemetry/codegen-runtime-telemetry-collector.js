"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenRuntimeTelemetryCollector = void 0;
const node_crypto_1 = require("node:crypto");
class CodeGenRuntimeTelemetryCollector {
    spans = new Map();
    start(name, metadata = {}) {
        const span = {
            id: (0, node_crypto_1.randomUUID)(),
            name,
            startedAt: new Date().toISOString(),
            metadata: structuredClone(metadata),
        };
        this.spans.set(span.id, span);
        return structuredClone(span);
    }
    complete(spanId, success = true, metadata = {}) {
        const span = this.spans.get(spanId);
        if (!span) {
            throw new Error(`Telemetry span was not found: ${spanId}`);
        }
        const completedAt = new Date().toISOString();
        span.completedAt =
            completedAt;
        span.durationMs =
            Date.parse(completedAt) -
                Date.parse(span.startedAt);
        span.success =
            success;
        span.metadata = {
            ...span.metadata,
            ...metadata,
        };
        return structuredClone(span);
    }
    snapshot() {
        const spans = Array.from(this.spans.values())
            .map((span) => structuredClone(span));
        return {
            spans,
            activeSpans: spans.filter((span) => !span.completedAt).length,
            completedSpans: spans.filter((span) => Boolean(span.completedAt)).length,
            failedSpans: spans.filter((span) => span.success ===
                false).length,
            generatedAt: new Date().toISOString(),
        };
    }
    clear() {
        this.spans.clear();
    }
}
exports.CodeGenRuntimeTelemetryCollector = CodeGenRuntimeTelemetryCollector;
//# sourceMappingURL=codegen-runtime-telemetry-collector.js.map