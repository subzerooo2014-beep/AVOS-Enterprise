"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenBlueprintRuntimeLoader = void 0;
const promises_1 = require("node:fs/promises");
const node_path_1 = require("node:path");
const codegen_errors_1 = require("../../core/codegen.errors");
const codegen_blueprint_runtime_metadata_contracts_1 = require("./codegen-blueprint-runtime-metadata.contracts");
const codegen_blueprint_runtime_registry_1 = require("./codegen-blueprint-runtime-registry");
class CodeGenBlueprintRuntimeLoader {
    registry;
    constructor(registry = new codegen_blueprint_runtime_registry_1.CodeGenBlueprintRuntimeRegistry()) {
        this.registry = registry;
    }
    async loadFile(filePath, replace = false) {
        const absolutePath = (0, node_path_1.resolve)(filePath);
        let parsed;
        try {
            parsed =
                JSON.parse(await (0, promises_1.readFile)(absolutePath, "utf8"));
        }
        catch (error) {
            throw new codegen_errors_1.CodeGenValidationError(`Unable to load blueprint file: ${absolutePath}`, error);
        }
        const definition = this.validateDefinition(parsed, absolutePath);
        const registered = this.registry.register(definition, {
            source: codegen_blueprint_runtime_metadata_contracts_1.CodeGenBlueprintRuntimeSource.FILESYSTEM,
            sourcePath: absolutePath,
            replace,
        });
        return {
            definition: registered,
            sourcePath: absolutePath,
            source: codegen_blueprint_runtime_metadata_contracts_1.CodeGenBlueprintRuntimeSource.FILESYSTEM,
            loadedAt: new Date().toISOString(),
        };
    }
    loadDefinition(definition, replace = false) {
        const registered = this.registry.register(definition, {
            source: codegen_blueprint_runtime_metadata_contracts_1.CodeGenBlueprintRuntimeSource.MEMORY,
            replace,
        });
        return {
            definition: registered,
            sourcePath: "memory",
            source: codegen_blueprint_runtime_metadata_contracts_1.CodeGenBlueprintRuntimeSource.MEMORY,
            loadedAt: new Date().toISOString(),
        };
    }
    validateDefinition(value, sourcePath) {
        if (!value ||
            typeof value !== "object" ||
            Array.isArray(value)) {
            throw new codegen_errors_1.CodeGenValidationError(`Blueprint definition must be a JSON object: ${sourcePath}`);
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
        if (!Array.isArray(record["dependencies"])) {
            throw new codegen_errors_1.CodeGenValidationError(`Blueprint dependencies must be an array: ${sourcePath}`);
        }
        if (!Array.isArray(record["capabilities"])) {
            throw new codegen_errors_1.CodeGenValidationError(`Blueprint capabilities must be an array: ${sourcePath}`);
        }
        if (!Array.isArray(record["tags"])) {
            throw new codegen_errors_1.CodeGenValidationError(`Blueprint tags must be an array: ${sourcePath}`);
        }
        return value;
    }
}
exports.CodeGenBlueprintRuntimeLoader = CodeGenBlueprintRuntimeLoader;
//# sourceMappingURL=codegen-blueprint-runtime-loader.js.map