"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenIncrementalGenerationEngine = void 0;
class CodeGenIncrementalGenerationEngine {
    shouldGenerate(current, next) {
        return current !== next;
    }
}
exports.CodeGenIncrementalGenerationEngine = CodeGenIncrementalGenerationEngine;
//# sourceMappingURL=codegen-incremental-generation-engine.js.map