"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenWorkspaceSynchronizer = void 0;
const promises_1 = require("node:fs/promises");
const node_path_1 = require("node:path");
class CodeGenWorkspaceSynchronizer {
    async synchronize(targetRoot, artifacts, dryRun = false) {
        const root = (0, node_path_1.resolve)(targetRoot);
        const written = [];
        const unchanged = [];
        const failed = [];
        const warnings = [];
        for (const artifact of artifacts) {
            const targetPath = (0, node_path_1.join)(root, artifact.relativePath);
            try {
                let current;
                try {
                    current =
                        await (0, promises_1.readFile)(targetPath, "utf8");
                }
                catch {
                    current =
                        undefined;
                }
                if (current ===
                    artifact.content) {
                    unchanged.push(artifact.relativePath);
                    continue;
                }
                if (!dryRun) {
                    await (0, promises_1.mkdir)((0, node_path_1.dirname)(targetPath), {
                        recursive: true,
                    });
                    await (0, promises_1.writeFile)(targetPath, artifact.content, "utf8");
                }
                written.push(artifact.relativePath);
            }
            catch (error) {
                failed.push(artifact.relativePath);
                warnings.push(error instanceof Error
                    ? error.message
                    : String(error));
            }
        }
        return {
            written,
            unchanged,
            failed,
            warnings,
            completedAt: new Date().toISOString(),
        };
    }
}
exports.CodeGenWorkspaceSynchronizer = CodeGenWorkspaceSynchronizer;
//# sourceMappingURL=codegen-workspace-synchronizer.js.map