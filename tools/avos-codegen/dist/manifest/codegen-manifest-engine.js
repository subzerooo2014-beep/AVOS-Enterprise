"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenManifestEngine = void 0;
const node_crypto_1 = require("node:crypto");
const codegen_errors_1 = require("../core/codegen.errors");
const codegen_version_1 = require("../core/codegen-version");
class CodeGenManifestEngine {
    manifests = new Map();
    create(input) {
        const key = input.key.trim();
        if (!key) {
            throw new codegen_errors_1.CodeGenValidationError("Manifest key is required");
        }
        if (this.manifests.has(key)) {
            throw new codegen_errors_1.CodeGenValidationError(`Manifest already exists: ${key}`);
        }
        if (input.dependencies?.includes(key)) {
            throw new codegen_errors_1.CodeGenValidationError(`Manifest cannot depend on itself: ${key}`);
        }
        const now = new Date().toISOString();
        const manifest = {
            id: (0, node_crypto_1.randomUUID)(),
            key,
            name: input.name.trim(),
            ...(input.description
                ? {
                    description: input.description,
                }
                : {}),
            type: input.type,
            version: input.version,
            enabled: input.enabled ?? true,
            ...(input.entrypoint
                ? {
                    entrypoint: input.entrypoint,
                }
                : {}),
            dependencies: Array.from(new Set(input.dependencies ?? [])),
            capabilities: Array.from(new Set(input.capabilities ?? [])),
            compatibility: {
                ...(input.minimumCodeGenVersion
                    ? {
                        minimumCodeGenVersion: input.minimumCodeGenVersion,
                    }
                    : {}),
                ...(input.maximumCodeGenVersion
                    ? {
                        maximumCodeGenVersion: input.maximumCodeGenVersion,
                    }
                    : {}),
                supportedAvosVersions: input.supportedAvosVersions ??
                    [],
            },
            metadata: input.metadata ?? {},
            createdAt: now,
            updatedAt: now,
        };
        this.manifests.set(key, manifest);
        return structuredClone(manifest);
    }
    register(manifest, replace = false) {
        if (this.manifests.has(manifest.key) &&
            !replace) {
            throw new codegen_errors_1.CodeGenValidationError(`Manifest already exists: ${manifest.key}`);
        }
        this.manifests.set(manifest.key, structuredClone(manifest));
        return structuredClone(manifest);
    }
    get(key) {
        const manifest = this.manifests.get(key);
        if (!manifest) {
            throw new codegen_errors_1.CodeGenValidationError(`Manifest was not found: ${key}`);
        }
        return structuredClone(manifest);
    }
    find(key) {
        const manifest = this.manifests.get(key);
        return manifest
            ? structuredClone(manifest)
            : undefined;
    }
    list() {
        return Array.from(this.manifests.values())
            .map((manifest) => structuredClone(manifest))
            .sort((left, right) => left.key.localeCompare(right.key));
    }
    remove(key) {
        const manifest = this.get(key);
        this.manifests.delete(key);
        return manifest;
    }
    verifyDependencies(key) {
        const manifest = this.get(key);
        const missingDependencies = manifest.dependencies.filter((dependencyKey) => !this.manifests.has(dependencyKey));
        return {
            valid: missingDependencies.length ===
                0,
            missingDependencies,
            checkedManifest: manifest.key,
            checkedVersion: (0, codegen_version_1.formatCodeGenVersion)(manifest.version),
        };
    }
    clear() {
        this.manifests.clear();
    }
}
exports.CodeGenManifestEngine = CodeGenManifestEngine;
//# sourceMappingURL=codegen-manifest-engine.js.map