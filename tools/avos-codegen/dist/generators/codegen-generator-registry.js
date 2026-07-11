"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenGeneratorRegistry = void 0;
const codegen_generator_contracts_1 = require("./codegen-generator.contracts");
const codegen_errors_1 = require("../core/codegen.errors");
class CodeGenGeneratorRegistry {
    generators = new Map();
    register(generator, replace = false) {
        const key = generator.descriptor.key.trim();
        if (!key) {
            throw new codegen_errors_1.CodeGenValidationError("Generator key is required");
        }
        if (this.generators.has(key) &&
            !replace) {
            throw new codegen_errors_1.CodeGenValidationError(`Generator already exists: ${key}`);
        }
        this.generators.set(key, generator);
        return generator;
    }
    get(key) {
        const generator = this.generators.get(key);
        if (!generator) {
            throw new codegen_errors_1.CodeGenValidationError(`Generator was not found: ${key}`);
        }
        return generator;
    }
    list() {
        return Array.from(this.generators.values())
            .filter((generator) => generator.descriptor.status ===
            codegen_generator_contracts_1.CodeGenGeneratorStatus.ACTIVE)
            .sort((a, b) => a.descriptor.key.localeCompare(b.descriptor.key));
    }
    remove(key) {
        const generator = this.get(key);
        this.generators.delete(key);
        return generator;
    }
    clear() {
        this.generators.clear();
    }
}
exports.CodeGenGeneratorRegistry = CodeGenGeneratorRegistry;
//# sourceMappingURL=codegen-generator-registry.js.map