"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenGeneratorV3ArtifactFactory = void 0;
const node_crypto_1 = require("node:crypto");
const codegen_filesystem_contracts_1 = require("../../../filesystem/codegen-filesystem.contracts");
class CodeGenGeneratorV3ArtifactFactory {
    create(input) {
        return {
            id: input.id,
            key: input.key,
            type: input.type,
            relativePath: input.relativePath,
            content: input.content,
            writeMode: codegen_filesystem_contracts_1.CodeGenWriteMode.CREATE,
            dependencies: [...(input.dependencies ?? [])],
            tags: [...(input.tags ?? [])],
            metadata: {
                generator: "generator-v3",
                ...(input.metadata ?? {}),
            },
            checksum: (0, node_crypto_1.createHash)("sha256")
                .update(input.content)
                .digest("hex"),
        };
    }
}
exports.CodeGenGeneratorV3ArtifactFactory = CodeGenGeneratorV3ArtifactFactory;
//# sourceMappingURL=codegen-generator-v3-artifact-factory.js.map