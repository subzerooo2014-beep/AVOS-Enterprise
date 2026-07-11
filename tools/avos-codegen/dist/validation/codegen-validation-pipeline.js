"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenValidationPipeline = void 0;
const codegen_errors_1 = require("../core/codegen.errors");
class CodeGenValidationPipeline {
    validators = new Map();
    register(validator, replace = false) {
        if (this.validators.has(validator.key) &&
            !replace) {
            throw new codegen_errors_1.CodeGenValidationError(`Validator already exists: ${validator.key}`);
        }
        this.validators.set(validator.key, validator);
        return validator;
    }
    get(key) {
        const validator = this.validators.get(key);
        if (!validator) {
            throw new codegen_errors_1.CodeGenValidationError(`Validator was not found: ${key}`);
        }
        return validator;
    }
    list() {
        return Array.from(this.validators.values())
            .sort((left, right) => right.priority - left.priority);
    }
    async run(context) {
        const results = [];
        for (const validator of this.list()) {
            results.push(await validator.validate(context));
        }
        const issueCount = results.reduce((total, result) => total + result.issues.length, 0);
        return {
            valid: results.every((result) => result.valid),
            results,
            issueCount,
            checkedAt: new Date().toISOString(),
        };
    }
    remove(key) {
        const validator = this.get(key);
        this.validators.delete(key);
        return validator;
    }
    clear() {
        this.validators.clear();
    }
}
exports.CodeGenValidationPipeline = CodeGenValidationPipeline;
//# sourceMappingURL=codegen-validation-pipeline.js.map