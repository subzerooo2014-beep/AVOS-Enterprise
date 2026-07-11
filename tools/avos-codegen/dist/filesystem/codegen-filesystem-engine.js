"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenFileSystemEngine = void 0;
const promises_1 = require("node:fs/promises");
const node_path_1 = require("node:path");
const codegen_errors_1 = require("../core/codegen.errors");
const codegen_filesystem_contracts_1 = require("./codegen-filesystem.contracts");
class CodeGenFileSystemEngine {
    async describe(workspaceRoot, targetPath) {
        const absolutePath = (0, node_path_1.resolve)(targetPath);
        const relativePath = (0, node_path_1.relative)((0, node_path_1.resolve)(workspaceRoot), absolutePath);
        try {
            const fileStat = await (0, promises_1.stat)(absolutePath);
            return {
                absolutePath,
                relativePath,
                exists: true,
                sizeBytes: fileStat.size,
                extension: (0, node_path_1.extname)(absolutePath),
                createdAt: fileStat.birthtime.toISOString(),
                updatedAt: fileStat.mtime.toISOString(),
            };
        }
        catch {
            return {
                absolutePath,
                relativePath,
                exists: false,
                sizeBytes: 0,
                extension: (0, node_path_1.extname)(absolutePath),
            };
        }
    }
    async read(targetPath, encoding = "utf8") {
        return (0, promises_1.readFile)((0, node_path_1.resolve)(targetPath), encoding);
    }
    async write(input) {
        const absolutePath = (0, node_path_1.resolve)(input.absolutePath);
        const descriptor = await this.describe(process.cwd(), absolutePath);
        if (descriptor.exists &&
            input.mode === codegen_filesystem_contracts_1.CodeGenWriteMode.CREATE) {
            throw new codegen_errors_1.CodeGenValidationError(`File already exists: ${absolutePath}`);
        }
        if (descriptor.exists &&
            input.mode === codegen_filesystem_contracts_1.CodeGenWriteMode.SKIP) {
            return {
                absolutePath,
                mode: input.mode,
                written: false,
                skipped: true,
                bytes: descriptor.sizeBytes,
                createdAt: new Date().toISOString(),
            };
        }
        await (0, promises_1.mkdir)((0, node_path_1.dirname)(absolutePath), { recursive: true });
        let content = input.content;
        if (descriptor.exists &&
            input.mode === codegen_filesystem_contracts_1.CodeGenWriteMode.MERGE) {
            const current = await this.read(absolutePath, input.encoding ?? "utf8");
            content = `${current}${current.endsWith("\n") ? "" : "\n"}${input.content}`;
        }
        await (0, promises_1.writeFile)(absolutePath, content, {
            encoding: input.encoding ?? "utf8",
        });
        return {
            absolutePath,
            mode: input.mode,
            written: true,
            skipped: false,
            bytes: Buffer.byteLength(content, input.encoding ?? "utf8"),
            createdAt: new Date().toISOString(),
        };
    }
}
exports.CodeGenFileSystemEngine = CodeGenFileSystemEngine;
//# sourceMappingURL=codegen-filesystem-engine.js.map