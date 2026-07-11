"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenGeneratorEngine = void 0;
const node_path_1 = require("node:path");
const codegen_filesystem_engine_1 = require("../filesystem/codegen-filesystem-engine");
const codegen_generator_registry_1 = require("./codegen-generator-registry");
class CodeGenGeneratorEngine {
    registry;
    fileSystem;
    constructor(registry = new codegen_generator_registry_1.CodeGenGeneratorRegistry(), fileSystem = new codegen_filesystem_engine_1.CodeGenFileSystemEngine()) {
        this.registry = registry;
        this.fileSystem = fileSystem;
    }
    async execute(key, context) {
        const generator = this.registry.get(key);
        const result = await generator.generate(context);
        const writes = [];
        if (result.success &&
            !context.dryRun) {
            for (const file of result.files) {
                writes.push(await this.fileSystem.write({
                    absolutePath: (0, node_path_1.resolve)(context.targetRoot, file.relativePath),
                    content: file.content,
                    mode: file.mode,
                }));
            }
        }
        return {
            result,
            writes,
        };
    }
}
exports.CodeGenGeneratorEngine = CodeGenGeneratorEngine;
//# sourceMappingURL=codegen-generator-engine.js.map