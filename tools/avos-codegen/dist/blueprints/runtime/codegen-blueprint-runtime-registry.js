"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenBlueprintRuntimeRegistry = void 0;
const codegen_errors_1 = require("../../core/codegen.errors");
const codegen_blueprint_contracts_1 = require("../codegen-blueprint.contracts");
const codegen_blueprint_runtime_metadata_contracts_1 = require("./codegen-blueprint-runtime-metadata.contracts");
class CodeGenBlueprintRuntimeRegistry {
    definitions = new Map();
    metadata = new Map();
    register(definition, options = {}) {
        const key = definition.key.trim();
        if (!key) {
            throw new codegen_errors_1.CodeGenValidationError("Blueprint runtime registry key is required");
        }
        if (this.definitions.has(key) &&
            options.replace !== true) {
            throw new codegen_errors_1.CodeGenValidationError(`Blueprint runtime definition already exists: ${key}`);
        }
        const normalized = {
            ...structuredClone(definition),
            key,
            dependencies: Array.from(new Set(definition.dependencies)),
            capabilities: Array.from(new Set(definition.capabilities)),
            tags: Array.from(new Set(definition.tags)),
            templateBindings: [...definition.templateBindings]
                .sort((left, right) => left.order -
                right.order),
            updatedAt: new Date().toISOString(),
        };
        this.definitions.set(key, normalized);
        const runtimeMetadata = {
            key,
            name: normalized.name,
            ...(normalized.description
                ? {
                    description: normalized.description,
                }
                : {}),
            version: structuredClone(normalized.version),
            source: options.source ??
                codegen_blueprint_runtime_metadata_contracts_1.CodeGenBlueprintRuntimeSource.MEMORY,
            ...(options.sourcePath
                ? {
                    sourcePath: options.sourcePath,
                }
                : {}),
            enabled: normalized.status ===
                codegen_blueprint_contracts_1.CodeGenBlueprintStatus.ACTIVE,
            category: normalized.category,
            capabilities: [...normalized.capabilities],
            dependencies: [...normalized.dependencies],
            tags: [...normalized.tags],
            templateKeys: normalized.templateBindings
                .filter((binding) => binding.enabled)
                .sort((left, right) => left.order -
                right.order)
                .map((binding) => binding.templateKey),
            metadata: structuredClone(normalized.metadata),
            discoveredAt: options.replace &&
                this.metadata.get(key)
                    ?.discoveredAt
                ? this.metadata.get(key)
                    .discoveredAt
                : new Date().toISOString(),
            registeredAt: new Date().toISOString(),
        };
        this.metadata.set(key, runtimeMetadata);
        return structuredClone(normalized);
    }
    get(key) {
        const definition = this.definitions.get(key);
        if (!definition) {
            throw new codegen_errors_1.CodeGenValidationError(`Blueprint runtime definition was not found: ${key}`);
        }
        return structuredClone(definition);
    }
    find(key) {
        const definition = this.definitions.get(key);
        return definition
            ? structuredClone(definition)
            : undefined;
    }
    getMetadata(key) {
        const value = this.metadata.get(key);
        if (!value) {
            throw new codegen_errors_1.CodeGenValidationError(`Blueprint runtime metadata was not found: ${key}`);
        }
        return structuredClone(value);
    }
    list(enabledOnly = false) {
        return Array.from(this.definitions.values())
            .filter((definition) => !enabledOnly ||
            definition.status ===
                codegen_blueprint_contracts_1.CodeGenBlueprintStatus.ACTIVE)
            .map((definition) => structuredClone(definition))
            .sort((left, right) => left.key.localeCompare(right.key));
    }
    listMetadata() {
        return Array.from(this.metadata.values())
            .map((value) => structuredClone(value))
            .sort((left, right) => left.key.localeCompare(right.key));
    }
    verifyDependencies(key) {
        const definition = this.get(key);
        const missingDependencies = definition.dependencies
            .filter((dependencyKey) => !this.definitions.has(dependencyKey));
        return {
            valid: missingDependencies.length ===
                0,
            missingDependencies,
        };
    }
    snapshot() {
        const metadata = this.listMetadata();
        return {
            registered: metadata.length,
            enabled: metadata.filter((item) => item.enabled).length,
            disabled: metadata.filter((item) => !item.enabled).length,
            categories: Array.from(new Set(metadata.map((item) => item.category))).sort(),
            capabilities: Array.from(new Set(metadata.flatMap((item) => item.capabilities))).sort(),
            dependencies: metadata.reduce((total, item) => total +
                item.dependencies.length, 0),
            generatedAt: new Date().toISOString(),
        };
    }
    remove(key) {
        const definition = this.get(key);
        this.definitions.delete(key);
        this.metadata.delete(key);
        return definition;
    }
    clear() {
        this.definitions.clear();
        this.metadata.clear();
    }
}
exports.CodeGenBlueprintRuntimeRegistry = CodeGenBlueprintRuntimeRegistry;
//# sourceMappingURL=codegen-blueprint-runtime-registry.js.map