"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenIncrementalSerializer = void 0;
class CodeGenIncrementalSerializer {
    serializeRun(run) {
        return JSON.stringify(run, null, 2);
    }
    serializePlan(plan) {
        return JSON.stringify(plan, null, 2);
    }
    serializeMetrics(metrics) {
        return JSON.stringify(metrics, null, 2);
    }
}
exports.CodeGenIncrementalSerializer = CodeGenIncrementalSerializer;
//# sourceMappingURL=codegen-incremental-serializer.js.map