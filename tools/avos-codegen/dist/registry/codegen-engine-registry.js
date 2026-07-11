"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenEngineRegistry = void 0;
const codegen_errors_1 = require("../core/codegen.errors");
class CodeGenEngineRegistry {
    engines = new Map();
    register(engine, options = {}) {
        this.validate(engine);
        const exists = this.engines.has(engine.descriptor.key);
        if (exists &&
            !options.replace) {
            throw new codegen_errors_1.CodeGenDuplicateEngineError(engine.descriptor.key);
        }
        this.engines.set(engine.descriptor.key, engine);
        return engine;
    }
    get(key) {
        const engine = this.engines.get(key);
        if (!engine) {
            throw new codegen_errors_1.CodeGenEngineNotFoundError(key);
        }
        return engine;
    }
    find(key) {
        return this.engines.get(key);
    }
    has(key) {
        return this.engines.has(key);
    }
    remove(key) {
        const engine = this.get(key);
        this.engines.delete(key);
        return engine;
    }
    list() {
        return Array.from(this.engines.values()).sort((left, right) => right.descriptor.priority -
            left.descriptor.priority);
    }
    listEnabled() {
        return this.list().filter((engine) => engine.descriptor.enabled);
    }
    count() {
        return this.engines.size;
    }
    clear() {
        this.engines.clear();
    }
    validate(engine) {
        const descriptor = engine.descriptor;
        if (!descriptor.key.trim()) {
            throw new codegen_errors_1.CodeGenValidationError("Engine key is required");
        }
        if (!descriptor.name.trim()) {
            throw new codegen_errors_1.CodeGenValidationError(`Engine name is required for ${descriptor.key}`);
        }
        if (!Number.isInteger(descriptor.priority)) {
            throw new codegen_errors_1.CodeGenValidationError(`Engine priority must be an integer: ${descriptor.key}`);
        }
        if (descriptor.dependencies
            .includes(descriptor.key)) {
            throw new codegen_errors_1.CodeGenValidationError(`Engine cannot depend on itself: ${descriptor.key}`);
        }
    }
}
exports.CodeGenEngineRegistry = CodeGenEngineRegistry;
//# sourceMappingURL=codegen-engine-registry.js.map