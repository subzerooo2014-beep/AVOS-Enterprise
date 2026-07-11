"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenQualityRuleRegistry = void 0;
const codegen_errors_1 = require("../../core/codegen.errors");
class CodeGenQualityRuleRegistry {
    rules = new Map();
    register(rule, replace = false) {
        const key = rule.descriptor.key.trim();
        if (!key) {
            throw new codegen_errors_1.CodeGenValidationError("Quality rule key is required");
        }
        if (this.rules.has(key) &&
            !replace) {
            throw new codegen_errors_1.CodeGenValidationError(`Quality rule already exists: ${key}`);
        }
        this.rules.set(key, rule);
        return rule;
    }
    get(key) {
        const rule = this.rules.get(key);
        if (!rule) {
            throw new codegen_errors_1.CodeGenValidationError(`Quality rule was not found: ${key}`);
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
exports.CodeGenQualityRuleRegistry = CodeGenQualityRuleRegistry;
//# sourceMappingURL=codegen-quality-rule-registry.js.map