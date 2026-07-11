"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenAtomicFileWriter = void 0;
const node_crypto_1 = require("node:crypto");
const promises_1 = require("node:fs/promises");
const node_path_1 = require("node:path");
class CodeGenAtomicFileWriter {
    async write(request) {
        const encoding = request.encoding ?? "utf8";
        const directory = (0, node_path_1.dirname)(request.absolutePath);
        await (0, promises_1.mkdir)(directory, {
            recursive: true,
        });
        const temporaryPath = `${request.absolutePath}.avos-codegen-${(0, node_crypto_1.randomUUID)()}.tmp`;
        try {
            await (0, promises_1.writeFile)(temporaryPath, request.content, {
                encoding,
                flag: "wx",
            });
            await (0, promises_1.rename)(temporaryPath, request.absolutePath);
        }
        catch (error) {
            await (0, promises_1.rm)(temporaryPath, {
                force: true,
            });
            throw error;
        }
        return {
            absolutePath: request.absolutePath,
            temporaryPath,
            checksum: (0, node_crypto_1.createHash)("sha256")
                .update(request.content)
                .digest("hex"),
            bytes: Buffer.byteLength(request.content, encoding),
            writtenAt: new Date().toISOString(),
        };
    }
}
exports.CodeGenAtomicFileWriter = CodeGenAtomicFileWriter;
//# sourceMappingURL=codegen-atomic-file-writer.js.map