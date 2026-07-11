"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenWorkspaceScanner = void 0;
const promises_1 = require("node:fs/promises");
const node_path_1 = require("node:path");
class CodeGenWorkspaceScanner {
    async scan(workspaceRoot, options = {}) {
        const root = (0, node_path_1.resolve)(workspaceRoot);
        const files = [];
        let directories = 0;
        const excluded = new Set(options.excludeDirectories ?? [
            "node_modules",
            ".git",
            "dist",
            "coverage",
        ]);
        const visit = async (current, depth) => {
            if (options.maximumDepth !== undefined &&
                depth > options.maximumDepth) {
                return;
            }
            const entries = await (0, promises_1.readdir)(current, { withFileTypes: true });
            for (const entry of entries) {
                const absolutePath = (0, node_path_1.join)(current, entry.name);
                if (entry.isDirectory()) {
                    if (excluded.has(entry.name)) {
                        continue;
                    }
                    directories += 1;
                    await visit(absolutePath, depth + 1);
                    continue;
                }
                if (!entry.isFile()) {
                    continue;
                }
                const extension = (0, node_path_1.extname)(entry.name);
                if (options.includeExtensions &&
                    !options.includeExtensions.includes(extension)) {
                    continue;
                }
                const fileStat = await (0, promises_1.stat)(absolutePath);
                files.push({
                    absolutePath,
                    relativePath: (0, node_path_1.relative)(root, absolutePath),
                    exists: true,
                    sizeBytes: fileStat.size,
                    extension,
                    createdAt: fileStat.birthtime.toISOString(),
                    updatedAt: fileStat.mtime.toISOString(),
                });
            }
        };
        await visit(root, 0);
        return {
            root,
            files: files.sort((a, b) => a.relativePath.localeCompare(b.relativePath)),
            directories,
            totalFiles: files.length,
            totalBytes: files.reduce((total, file) => total + file.sizeBytes, 0),
            scannedAt: new Date().toISOString(),
        };
    }
}
exports.CodeGenWorkspaceScanner = CodeGenWorkspaceScanner;
//# sourceMappingURL=codegen-workspace-scanner.js.map