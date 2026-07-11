"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenBlueprintRuntimeDiscovery = void 0;
const promises_1 = require("node:fs/promises");
const node_path_1 = require("node:path");
const codegen_errors_1 = require("../../core/codegen.errors");
const codegen_blueprint_runtime_metadata_contracts_1 = require("./codegen-blueprint-runtime-metadata.contracts");
const codegen_blueprint_runtime_registry_1 = require("./codegen-blueprint-runtime-registry");
class CodeGenBlueprintRuntimeDiscovery {
    registry;
    constructor(registry = new codegen_blueprint_runtime_registry_1.CodeGenBlueprintRuntimeRegistry()) {
        this.registry = registry;
    }
    async discoverDirectory(rootPath, replace = false) {
        const absoluteRoot = (0, node_path_1.resolve)(rootPath);
        const files = await this.walk(absoluteRoot);
        const blueprintFiles = files
            .filter((file) => file.endsWith(".blueprint.json"))
            .sort();
        const discovered = [];
        const registered = [];
        const warnings = [];
        const errors = [];
        for (const blueprintFile of blueprintFiles) {
            try {
                const raw = await (0, promises_1.readFile)(blueprintFile, "utf8");
                const parsed = JSON.parse(raw);
                const definition = this.validateDefinition(parsed, blueprintFile);
                registered.push(this.registry.register(definition, {
                    source: codegen_blueprint_runtime_metadata_contracts_1.CodeGenBlueprintRuntimeSource.FILESYSTEM,
                    sourcePath: blueprintFile,
                    replace,
                }));
                discovered.push({
                    key: definition.key,
                    source: codegen_blueprint_runtime_metadata_contracts_1.CodeGenBlueprintRuntimeSource.FILESYSTEM,
                    sourcePath: blueprintFile,
                    valid: true,
                    warnings: [],
                    errors: [],
                    metadata: {
                        name: definition.name,
                        category: definition.category,
                        templates: definition
                            .templateBindings
                            .length,
                    },
                    discoveredAt: new Date().toISOString(),
                });
            }
            catch (error) {
                const message = error instanceof Error
                    ? error.message
                    : String(error);
                errors.push(`${blueprintFile}: ${message}`);
                discovered.push({
                    key: blueprintFile,
                    source: codegen_blueprint_runtime_metadata_contracts_1.CodeGenBlueprintRuntimeSource.FILESYSTEM,
                    sourcePath: blueprintFile,
                    valid: false,
                    warnings: [],
                    errors: [
                        message,
                    ],
                    discoveredAt: new Date().toISOString(),
                });
            }
        }
        if (blueprintFiles.length === 0) {
            warnings.push(`No blueprint manifests were found in ${absoluteRoot}`);
        }
        return {
            rootPath: absoluteRoot,
            discovered,
            registered,
            warnings,
            errors,
            completedAt: new Date().toISOString(),
        };
    }
    validateDefinition(value, sourcePath) {
        if (!value ||
            typeof value !== "object" ||
            Array.isArray(value)) {
            throw new codegen_errors_1.CodeGenValidationError(`Blueprint file must contain a JSON object: ${sourcePath}`);
        }
        const record = value;
        const requiredStrings = [
            "id",
            "key",
            "name",
            "category",
            "status",
            "createdAt",
            "updatedAt",
        ];
        for (const property of requiredStrings) {
            if (typeof record[property] !==
                "string" ||
                !record[property]
                    .trim()) {
                throw new codegen_errors_1.CodeGenValidationError(`Blueprint property is required: ${property} in ${sourcePath}`);
            }
        }
        if (!record["version"] ||
            typeof record["version"] !==
                "object" ||
            Array.isArray(record["version"])) {
            throw new codegen_errors_1.CodeGenValidationError(`Blueprint version is required: ${sourcePath}`);
        }
        if (!Array.isArray(record["templateBindings"])) {
            throw new codegen_errors_1.CodeGenValidationError(`Blueprint templateBindings must be an array: ${sourcePath}`);
        }
        return value;
    }
    async walk(directory) {
        const entries = await (0, promises_1.readdir)(directory, {
            withFileTypes: true,
        });
        const files = [];
        for (const entry of entries) {
            const absolutePath = (0, node_path_1.join)(directory, entry.name);
            if (entry.isDirectory()) {
                files.push(...await this.walk(absolutePath));
            }
            else if (entry.isFile()) {
                files.push(absolutePath);
            }
        }
        return files;
    }
}
exports.CodeGenBlueprintRuntimeDiscovery = CodeGenBlueprintRuntimeDiscovery;
//# sourceMappingURL=codegen-blueprint-runtime-discovery.js.map