"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenConfigurationEngine = void 0;
const promises_1 = require("node:fs/promises");
const node_path_1 = require("node:path");
const codegen_contracts_1 = require("../core/codegen.contracts");
const codegen_errors_1 = require("../core/codegen.errors");
class CodeGenConfigurationEngine {
    entries = new Map();
    set(key, value, options = {}) {
        const normalizedKey = key.trim();
        if (!normalizedKey) {
            throw new codegen_errors_1.CodeGenValidationError("Configuration key is required");
        }
        const existing = this.entries.get(normalizedKey);
        if (existing?.readonly &&
            options.overwrite !== true) {
            throw new codegen_errors_1.CodeGenValidationError(`Configuration entry is readonly: ${normalizedKey}`);
        }
        if (existing &&
            options.overwrite === false) {
            throw new codegen_errors_1.CodeGenValidationError(`Configuration entry already exists: ${normalizedKey}`);
        }
        const entry = {
            key: normalizedKey,
            value: structuredClone(value),
            source: options.source ??
                codegen_contracts_1.CodeGenConfigurationSource.RUNTIME,
            readonly: options.readonly ?? false,
            ...(options.description
                ? {
                    description: options.description,
                }
                : {}),
            updatedAt: new Date().toISOString(),
        };
        this.entries.set(normalizedKey, entry);
        return structuredClone(entry);
    }
    get(key) {
        const entry = this.entries.get(key);
        if (!entry) {
            throw new codegen_errors_1.CodeGenValidationError(`Configuration entry was not found: ${key}`);
        }
        return structuredClone(entry.value);
    }
    find(key) {
        const entry = this.entries.get(key);
        return entry
            ? structuredClone(entry.value)
            : undefined;
    }
    has(key) {
        return this.entries.has(key);
    }
    remove(key) {
        const entry = this.entries.get(key);
        if (!entry) {
            throw new codegen_errors_1.CodeGenValidationError(`Configuration entry was not found: ${key}`);
        }
        if (entry.readonly) {
            throw new codegen_errors_1.CodeGenValidationError(`Readonly configuration cannot be removed: ${key}`);
        }
        this.entries.delete(key);
        return structuredClone(entry);
    }
    list() {
        return Array.from(this.entries.values())
            .map((entry) => structuredClone(entry))
            .sort((left, right) => left.key.localeCompare(right.key));
    }
    snapshot() {
        const entries = this.list();
        return {
            entries,
            count: entries.length,
            generatedAt: new Date().toISOString(),
        };
    }
    loadDefaults(values) {
        for (const [key, value] of Object.entries(values)) {
            if (!this.has(key)) {
                this.set(key, value, {
                    source: codegen_contracts_1.CodeGenConfigurationSource.DEFAULT,
                    overwrite: false,
                });
            }
        }
    }
    loadEnvironment(prefix = "AVOS_CODEGEN_") {
        for (const [key, value] of Object.entries(process.env)) {
            if (!key.startsWith(prefix) ||
                value === undefined) {
                continue;
            }
            const normalizedKey = key
                .slice(prefix.length)
                .toLowerCase()
                .replaceAll("__", ".")
                .replaceAll("_", "-");
            this.set(normalizedKey, value, {
                source: codegen_contracts_1.CodeGenConfigurationSource.ENVIRONMENT,
                overwrite: true,
            });
        }
    }
    async loadJsonFile(filePath) {
        const absolutePath = (0, node_path_1.resolve)(filePath);
        const raw = await (0, promises_1.readFile)(absolutePath, "utf8");
        const parsed = JSON.parse(raw);
        if (!parsed ||
            typeof parsed !== "object" ||
            Array.isArray(parsed)) {
            throw new codegen_errors_1.CodeGenValidationError(`Configuration file must contain a JSON object: ${absolutePath}`);
        }
        for (const [key, value] of Object.entries(parsed)) {
            this.set(key, value, {
                source: codegen_contracts_1.CodeGenConfigurationSource.FILE,
                overwrite: true,
            });
        }
    }
    clear() {
        for (const entry of this.entries.values()) {
            if (!entry.readonly) {
                this.entries.delete(entry.key);
            }
        }
    }
}
exports.CodeGenConfigurationEngine = CodeGenConfigurationEngine;
//# sourceMappingURL=codegen-configuration-engine.js.map