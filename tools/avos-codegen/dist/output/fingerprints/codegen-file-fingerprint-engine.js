"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenFileFingerprintEngine = void 0;
const node_crypto_1 = require("node:crypto");
const promises_1 = require("node:fs/promises");
class CodeGenFileFingerprintEngine {
    async fingerprint(absolutePath) {
        try {
            const [content, fileStat] = await Promise.all([
                (0, promises_1.readFile)(absolutePath),
                (0, promises_1.stat)(absolutePath),
            ]);
            return {
                absolutePath,
                exists: true,
                sizeBytes: fileStat.size,
                checksum: (0, node_crypto_1.createHash)("sha256")
                    .update(content)
                    .digest("hex"),
                modifiedAt: fileStat.mtime.toISOString(),
                generatedAt: new Date().toISOString(),
            };
        }
        catch {
            return {
                absolutePath,
                exists: false,
                sizeBytes: 0,
                generatedAt: new Date().toISOString(),
            };
        }
    }
    fingerprintContent(absolutePath, content) {
        return {
            absolutePath,
            exists: true,
            sizeBytes: Buffer.byteLength(content, "utf8"),
            checksum: (0, node_crypto_1.createHash)("sha256")
                .update(content)
                .digest("hex"),
            generatedAt: new Date().toISOString(),
        };
    }
}
exports.CodeGenFileFingerprintEngine = CodeGenFileFingerprintEngine;
//# sourceMappingURL=codegen-file-fingerprint-engine.js.map