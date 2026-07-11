"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenOutputManifestEngine = void 0;
const node_crypto_1 = require("node:crypto");
const promises_1 = require("node:fs/promises");
const node_path_1 = require("node:path");
class CodeGenOutputManifestEngine {
    create(input) {
        const payload = JSON.stringify(input.entries);
        return {
            id: (0, node_crypto_1.randomUUID)(),
            sessionId: input.sessionId,
            workspaceRoot: (0, node_path_1.resolve)(input.workspaceRoot),
            targetRoot: (0, node_path_1.resolve)(input.targetRoot),
            entries: structuredClone([...input.entries]),
            checksum: (0, node_crypto_1.createHash)("sha256")
                .update(payload)
                .digest("hex"),
            generatedAt: new Date().toISOString(),
        };
    }
    async write(manifest, filePath) {
        const outputPath = filePath ??
            (0, node_path_1.join)(manifest.targetRoot, ".avos-codegen", "output-manifest.json");
        await (0, promises_1.mkdir)((0, node_path_1.dirname)(outputPath), {
            recursive: true,
        });
        await (0, promises_1.writeFile)(outputPath, JSON.stringify(manifest, null, 2), "utf8");
        return outputPath;
    }
}
exports.CodeGenOutputManifestEngine = CodeGenOutputManifestEngine;
//# sourceMappingURL=codegen-output-manifest-engine.js.map