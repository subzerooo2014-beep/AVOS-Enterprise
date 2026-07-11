"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenOutputPreviewEngine = void 0;
const node_crypto_1 = require("node:crypto");
const node_path_1 = require("node:path");
const codegen_output_contracts_1 = require("../codegen-output.contracts");
const codegen_output_conflict_detector_1 = require("../conflicts/codegen-output-conflict-detector");
class CodeGenOutputPreviewEngine {
    conflicts;
    constructor(conflicts = new codegen_output_conflict_detector_1.CodeGenOutputConflictDetector()) {
        this.conflicts = conflicts;
    }
    async preview(input) {
        const entries = [];
        const conflicts = [];
        for (const artifact of input.artifacts) {
            const absolutePath = (0, node_path_1.resolve)(input.targetRoot, artifact.relativePath);
            const conflict = await this.conflicts.detect({
                artifactKey: artifact.key,
                targetRoot: input.targetRoot,
                absolutePath,
                content: artifact.content,
                policy: input.policy,
            });
            conflicts.push(conflict);
            const action = conflict.type === "none"
                ? "create"
                : conflict.allowed
                    ? input.policy ===
                        codegen_output_contracts_1.CodeGenConflictPolicy.SKIP
                        ? "skip"
                        : "overwrite"
                    : "error";
            entries.push({
                artifactKey: artifact.key,
                relativePath: artifact.relativePath,
                absolutePath,
                action,
                conflictType: conflict.type,
                checksum: (0, node_crypto_1.createHash)("sha256")
                    .update(artifact.content)
                    .digest("hex"),
                bytes: Buffer.byteLength(artifact.content, "utf8"),
            });
        }
        return {
            valid: entries.every((entry) => entry.action !==
                "error"),
            entries,
            conflicts,
            generatedAt: new Date().toISOString(),
        };
    }
}
exports.CodeGenOutputPreviewEngine = CodeGenOutputPreviewEngine;
//# sourceMappingURL=codegen-output-preview-engine.js.map