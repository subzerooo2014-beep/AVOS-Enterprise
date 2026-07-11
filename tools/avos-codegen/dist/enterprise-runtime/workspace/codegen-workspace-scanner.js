"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenWorkspaceScanner = void 0;
const node_crypto_1 = require("node:crypto");
const promises_1 = require("node:fs/promises");
const node_path_1 = require("node:path");
class CodeGenWorkspaceScanner {
    async scan(workspaceRoot, optionsInput = {}) {
        const startedAt = new Date().toISOString();
        const root = (0, node_path_1.resolve)(workspaceRoot);
        const options = {
            includeExtensions: optionsInput.includeExtensions ??
                [
                    ".ts",
                    ".tsx",
                    ".js",
                    ".json",
                    ".prisma",
                    ".md",
                ],
            excludeDirectories: optionsInput.excludeDirectories ??
                [
                    "node_modules",
                    "dist",
                    ".git",
                    ".avos-codegen",
                ],
            includeHidden: optionsInput.includeHidden ??
                false,
            calculateChecksums: optionsInput.calculateChecksums ??
                false,
            maximumFiles: Math.max(1, optionsInput.maximumFiles ??
                25000),
        };
        const files = [];
        const warnings = [];
        const errors = [];
        let scannedDirectories = 0;
        let skippedDirectories = 0;
        const walk = async (directory) => {
            if (files.length >=
                options.maximumFiles) {
                warnings.push(`Workspace scan reached maximum file limit: ${options.maximumFiles}`);
                return;
            }
            scannedDirectories += 1;
            let entries;
            try {
                entries =
                    await (0, promises_1.readdir)(directory, {
                        withFileTypes: true,
                    });
            }
            catch (error) {
                errors.push(error instanceof Error
                    ? error.message
                    : String(error));
                return;
            }
            for (const entry of entries) {
                if (!options.includeHidden &&
                    entry.name.startsWith(".")) {
                    continue;
                }
                const absolutePath = (0, node_path_1.join)(directory, entry.name);
                if (entry.isDirectory()) {
                    if (options.excludeDirectories.includes(entry.name)) {
                        skippedDirectories += 1;
                        continue;
                    }
                    await walk(absolutePath);
                    continue;
                }
                if (!entry.isFile()) {
                    continue;
                }
                const extension = (0, node_path_1.extname)(entry.name).toLowerCase();
                if (options.includeExtensions.length > 0 &&
                    !options.includeExtensions.includes(extension)) {
                    continue;
                }
                const fileStat = await (0, promises_1.stat)(absolutePath);
                let checksum;
                if (options.calculateChecksums) {
                    const content = await (0, promises_1.readFile)(absolutePath);
                    checksum =
                        (0, node_crypto_1.createHash)("sha256")
                            .update(content)
                            .digest("hex");
                }
                files.push({
                    relativePath: (0, node_path_1.relative)(root, absolutePath).replaceAll("\\", "/"),
                    absolutePath,
                    extension,
                    sizeBytes: fileStat.size,
                    modifiedAt: fileStat.mtime
                        .toISOString(),
                    ...(checksum
                        ? {
                            checksum,
                        }
                        : {}),
                    metadata: {},
                });
                if (files.length >=
                    options.maximumFiles) {
                    break;
                }
            }
        };
        await walk(root);
        const completedAt = new Date().toISOString();
        return {
            workspaceRoot: root,
            files: files.sort((left, right) => left.relativePath.localeCompare(right.relativePath)),
            scannedDirectories,
            skippedDirectories,
            warnings,
            errors,
            startedAt,
            completedAt,
            durationMs: Date.parse(completedAt) -
                Date.parse(startedAt),
        };
    }
}
exports.CodeGenWorkspaceScanner = CodeGenWorkspaceScanner;
//# sourceMappingURL=codegen-workspace-scanner.js.map