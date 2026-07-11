"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenGeneratorAdapter = void 0;
const node_crypto_1 = require("node:crypto");
const codegen_artifact_contracts_1 = require("../../artifacts/codegen-artifact.contracts");
const codegen_generator_engine_1 = require("../../generators/codegen-generator-engine");
class CodeGenGeneratorAdapter {
    engine;
    constructor(engine = new codegen_generator_engine_1.CodeGenGeneratorEngine()) {
        this.engine = engine;
    }
    async execute(request) {
        const executed = await this.engine.execute(request.generatorKey, {
            ...request.context,
            dryRun: true,
        });
        const artifacts = executed.result.files.map((file, index) => ({
            id: `${request.generatorKey}:${index}:${file.relativePath}`,
            key: `${request.generatorKey}.${index}.${file.relativePath}`,
            type: this.resolveArtifactType(file.relativePath),
            relativePath: file.relativePath,
            content: file.content,
            writeMode: file.mode,
            dependencies: [],
            tags: [
                "generator-adapter",
                request.generatorKey,
            ],
            metadata: {
                generatorKey: request.generatorKey,
                generatedIndex: index,
            },
            checksum: (0, node_crypto_1.createHash)("sha256")
                .update(file.content)
                .digest("hex"),
        }));
        return {
            generatorResult: executed.result,
            artifacts,
            warnings: [...executed.result.warnings],
            adaptedAt: new Date().toISOString(),
        };
    }
    resolveArtifactType(relativePath) {
        if (relativePath.includes(".spec.") ||
            relativePath.includes(".test.")) {
            return codegen_artifact_contracts_1.CodeGenArtifactType.TEST;
        }
        if (relativePath.endsWith(".md")) {
            return codegen_artifact_contracts_1.CodeGenArtifactType.DOCUMENTATION;
        }
        if (relativePath.includes("manifest")) {
            return codegen_artifact_contracts_1.CodeGenArtifactType.MANIFEST;
        }
        if (relativePath.endsWith(".json")) {
            return codegen_artifact_contracts_1.CodeGenArtifactType.CONFIGURATION;
        }
        return codegen_artifact_contracts_1.CodeGenArtifactType.SOURCE;
    }
}
exports.CodeGenGeneratorAdapter = CodeGenGeneratorAdapter;
//# sourceMappingURL=codegen-generator-adapter.js.map