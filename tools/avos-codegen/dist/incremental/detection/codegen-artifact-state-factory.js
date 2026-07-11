"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenArtifactStateFactory = void 0;
const node_crypto_1 = require("node:crypto");
class CodeGenArtifactStateFactory {
    create(artifact) {
        return {
            artifactKey: artifact.key,
            relativePath: artifact.relativePath,
            checksum: artifact.checksum ??
                (0, node_crypto_1.createHash)("sha256")
                    .update(artifact.content)
                    .digest("hex"),
            sizeBytes: Buffer.byteLength(artifact.content, "utf8"),
            generatedAt: new Date().toISOString(),
            metadata: structuredClone(artifact.metadata),
        };
    }
    createMany(artifacts) {
        return artifacts.map((artifact) => this.create(artifact));
    }
}
exports.CodeGenArtifactStateFactory = CodeGenArtifactStateFactory;
//# sourceMappingURL=codegen-artifact-state-factory.js.map