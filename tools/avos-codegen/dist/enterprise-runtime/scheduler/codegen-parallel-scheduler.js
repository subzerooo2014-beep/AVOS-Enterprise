"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenParallelScheduler = void 0;
class CodeGenParallelScheduler {
    schedule(nodes) {
        return [...nodes].sort((a, b) => a.priority - b.priority);
    }
}
exports.CodeGenParallelScheduler = CodeGenParallelScheduler;
//# sourceMappingURL=codegen-parallel-scheduler.js.map