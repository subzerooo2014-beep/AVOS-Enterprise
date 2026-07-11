"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenBlueprintRegistry = void 0;
const node_crypto_1 = require("node:crypto");
const codegen_blueprint_contracts_1 = require("./codegen-blueprint.contracts");
const codegen_errors_1 = require("../core/codegen.errors");
class CodeGenBlueprintRegistry {
    blueprints = new Map();
    create(input) {
        const key = input.key.trim();
        if (!key) {
            throw new codegen_errors_1.CodeGenValidationError("Blueprint key is required");
        }
        if (this.blueprints.has(key)) {
            throw new codegen_errors_1.CodeGenValidationError(`Blueprint already exists: ${key}`);
        }
        if (input.dependencies?.includes(key)) {
            throw new codegen_errors_1.CodeGenValidationError(`Blueprint cannot depend on itself: ${key}`);
        }
        const now = new Date().toISOString();
        const blueprint = {
            id: (0, node_crypto_1.randomUUID)(),
            key,
            name: input.name.trim(),
            ...(input.description
                ? { description: input.description }
                : {}),
            version: input.version,
            status: codegen_blueprint_contracts_1.CodeGenBlueprintStatus.ACTIVE,
            category: input.category.trim(),
            templateBindings: [...input.templateBindings]
                .sort((a, b) => a.order - b.order),
            dependencies: Array.from(new Set(input.dependencies ?? [])),
            capabilities: Array.from(new Set(input.capabilities ?? [])),
            tags: Array.from(new Set(input.tags ?? [])),
            metadata: input.metadata ?? {},
            createdAt: now,
            updatedAt: now,
        };
        this.blueprints.set(key, blueprint);
        return structuredClone(blueprint);
    }
    register(blueprint, replace = false) {
        if (this.blueprints.has(blueprint.key) &&
            !replace) {
            throw new codegen_errors_1.CodeGenValidationError(`Blueprint already exists: ${blueprint.key}`);
        }
        this.blueprints.set(blueprint.key, structuredClone(blueprint));
        return structuredClone(blueprint);
    }
    get(key) {
        const blueprint = this.blueprints.get(key);
        if (!blueprint) {
            throw new codegen_errors_1.CodeGenValidationError(`Blueprint was not found: ${key}`);
        }
        return structuredClone(blueprint);
    }
    list() {
        return Array.from(this.blueprints.values())
            .map((item) => structuredClone(item))
            .sort((a, b) => a.key.localeCompare(b.key));
    }
    createExecutionPlan(input) {
        const blueprint = this.get(input.blueprintKey);
        if (blueprint.status !==
            codegen_blueprint_contracts_1.CodeGenBlueprintStatus.ACTIVE) {
            throw new codegen_errors_1.CodeGenValidationError(`Blueprint is not active: ${blueprint.key}`);
        }
        return {
            blueprintKey: blueprint.key,
            templates: blueprint.templateBindings
                .filter((binding) => binding.enabled)
                .sort((a, b) => a.order - b.order),
            variables: structuredClone(input.variables),
            dryRun: input.dryRun,
            createdAt: new Date().toISOString(),
        };
    }
    verifyDependencies(key) {
        const blueprint = this.get(key);
        const missingDependencies = blueprint.dependencies.filter((dependencyKey) => !this.blueprints.has(dependencyKey));
        return {
            valid: missingDependencies.length === 0,
            missingDependencies,
        };
    }
    remove(key) {
        const blueprint = this.get(key);
        this.blueprints.delete(key);
        return blueprint;
    }
    clear() {
        this.blueprints.clear();
    }
}
exports.CodeGenBlueprintRegistry = CodeGenBlueprintRegistry;
//# sourceMappingURL=codegen-blueprint-registry.js.map