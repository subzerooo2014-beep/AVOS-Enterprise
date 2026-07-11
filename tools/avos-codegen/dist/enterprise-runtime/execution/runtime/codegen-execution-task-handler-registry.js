"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenExecutionTaskHandlerRegistry = void 0;
const codegen_errors_1 = require("../../../core/codegen.errors");
class CodeGenExecutionTaskHandlerRegistry {
    handlers = new Map();
    register(handler, replace = false) {
        if (this.handlers.has(handler.type) &&
            !replace) {
            throw new codegen_errors_1.CodeGenValidationError(`Execution task handler already exists: ${handler.type}`);
        }
        this.handlers.set(handler.type, handler);
        return handler;
    }
    get(type) {
        const handler = this.handlers.get(type);
        if (!handler) {
            throw new codegen_errors_1.CodeGenValidationError(`Execution task handler was not found: ${type}`);
        }
        return handler;
    }
    list() {
        return Array.from(this.handlers.values());
    }
    clear() {
        this.handlers.clear();
    }
}
exports.CodeGenExecutionTaskHandlerRegistry = CodeGenExecutionTaskHandlerRegistry;
//# sourceMappingURL=codegen-execution-task-handler-registry.js.map