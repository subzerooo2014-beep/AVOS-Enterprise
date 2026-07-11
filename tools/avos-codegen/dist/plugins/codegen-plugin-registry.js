"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenPluginRegistry = void 0;
const codegen_contracts_1 = require("../core/codegen.contracts");
const codegen_errors_1 = require("../core/codegen.errors");
class CodeGenPluginRegistry {
    plugins = new Map();
    register(plugin, replace = false) {
        const key = plugin.descriptor.key.trim();
        if (!key) {
            throw new codegen_errors_1.CodeGenValidationError("Plugin key is required");
        }
        if (this.plugins.has(key) &&
            !replace) {
            throw new codegen_errors_1.CodeGenValidationError(`Plugin is already registered: ${key}`);
        }
        const descriptor = {
            ...structuredClone(plugin.descriptor),
            status: codegen_contracts_1.CodeGenPluginStatus.REGISTERED,
            registeredAt: new Date().toISOString(),
        };
        const registered = {
            ...plugin,
            descriptor,
        };
        this.plugins.set(key, registered);
        return registered;
    }
    get(key) {
        const plugin = this.plugins.get(key);
        if (!plugin) {
            throw new codegen_errors_1.CodeGenValidationError(`Plugin was not found: ${key}`);
        }
        return plugin;
    }
    find(key) {
        return this.plugins.get(key);
    }
    list() {
        return Array.from(this.plugins.values()).sort((left, right) => left.descriptor.key.localeCompare(right.descriptor.key));
    }
    listEnabled() {
        return this.list().filter((plugin) => plugin.descriptor.enabled &&
            plugin.descriptor.status !==
                codegen_contracts_1.CodeGenPluginStatus.DISABLED);
    }
    async initializeAll(context) {
        for (const plugin of this.resolveOrder()) {
            plugin.descriptor.status =
                codegen_contracts_1.CodeGenPluginStatus.INITIALIZING;
            try {
                await plugin.initialize?.(context);
                await plugin.activate?.(context);
                plugin.descriptor.status =
                    codegen_contracts_1.CodeGenPluginStatus.READY;
                plugin.descriptor.initializedAt =
                    new Date().toISOString();
                delete plugin.descriptor.error;
            }
            catch (error) {
                plugin.descriptor.status =
                    codegen_contracts_1.CodeGenPluginStatus.FAILED;
                plugin.descriptor.failedAt =
                    new Date().toISOString();
                plugin.descriptor.error =
                    error instanceof Error
                        ? error.message
                        : "Unknown plugin initialization failure";
                throw error;
            }
        }
    }
    async deactivateAll(context) {
        const plugins = [...this.resolveOrder()]
            .reverse();
        for (const plugin of plugins) {
            await plugin.deactivate?.(context);
            plugin.descriptor.status =
                codegen_contracts_1.CodeGenPluginStatus.REGISTERED;
        }
    }
    remove(key) {
        const plugin = this.get(key);
        plugin.descriptor.status =
            codegen_contracts_1.CodeGenPluginStatus.REMOVED;
        this.plugins.delete(key);
        return plugin;
    }
    clear() {
        this.plugins.clear();
    }
    resolveOrder() {
        const ordered = [];
        const visiting = new Set();
        const visited = new Set();
        const visit = (plugin) => {
            const key = plugin.descriptor.key;
            if (visited.has(key)) {
                return;
            }
            if (visiting.has(key)) {
                throw new codegen_errors_1.CodeGenValidationError(`Circular plugin dependency detected at ${key}`);
            }
            visiting.add(key);
            for (const dependencyKey of plugin.descriptor.dependencies) {
                const dependency = this.plugins.get(dependencyKey);
                if (!dependency) {
                    throw new codegen_errors_1.CodeGenValidationError(`Plugin dependency was not found: ${dependencyKey}`);
                }
                visit(dependency);
            }
            visiting.delete(key);
            visited.add(key);
            if (plugin.descriptor.enabled) {
                ordered.push(plugin);
            }
        };
        for (const plugin of this.listEnabled()) {
            visit(plugin);
        }
        return ordered;
    }
}
exports.CodeGenPluginRegistry = CodeGenPluginRegistry;
//# sourceMappingURL=codegen-plugin-registry.js.map