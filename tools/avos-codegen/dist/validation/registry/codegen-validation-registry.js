"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenValidationRegistry = void 0;
const codegen_errors_1 = require("../../core/codegen.errors");
class CodeGenValidationRegistry {
    rules = new Map();
    register(rule, replace = false) {
        const key = rule.descriptor.key.trim();
        if (!key) {
            throw new codegen_errors_1.CodeGenValidationError("Validation rule key is required");
        }
        if (this.rules.has(key) &&
            !replace) {
            throw new codegen_errors_1.CodeGenValidationError(`Validation rule already exists: ${key}`);
        }
        this.rules.set(key, rule);
        return rule;
    }
    get(key) {
        const rule = this.rules.get(key);
        if (!rule) {
            throw new codegen_errors_1.CodeGenValidationError(`Validation rule was not found: ${key}`);
        }
        return rule;
    }
    list() {
        return Array.from(this.rules.values())
            .filter((rule) => rule.descriptor.enabled)
            .sort((left, right) => left.descriptor.priority -
            right.descriptor.priority);
    }
    clear() {
        this.rules.clear();
    }
}
exports.CodeGenValidationRegistry = CodeGenValidationRegistry;
//# sourceMappingURL=codegen-validation-registry.js.map