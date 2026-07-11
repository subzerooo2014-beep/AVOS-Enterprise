"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenOutputConflictDetector = void 0;
const node_path_1 = require("node:path");
const codegen_errors_1 = require("../../core/codegen.errors");
const codegen_output_contracts_1 = require("../codegen-output.contracts");
const codegen_file_fingerprint_engine_1 = require("../fingerprints/codegen-file-fingerprint-engine");
class CodeGenOutputConflictDetector {
    fingerprints;
    constructor(fingerprints = new codegen_file_fingerprint_engine_1.CodeGenFileFingerprintEngine()) {
        this.fingerprints = fingerprints;
    }
    async detect(input) {
        const root = (0, node_path_1.resolve)(input.targetRoot);
        const path = (0, node_path_1.resolve)(input.absolutePath);
        const relativePath = (0, node_path_1.relative)(root, path);
        if (relativePath.startsWith("..") ||
            relativePath === "..") {
            return {
                artifactKey: input.artifactKey,
                absolutePath: path,
                type: codegen_output_contracts_1.CodeGenConflictType.PATH_OUTSIDE_TARGET,
                policy: input.policy,
                allowed: false,
                reason: "Artifact path resolves outside target root",
                detectedAt: new Date().toISOString(),
            };
        }
        const existing = await this.fingerprints
            .fingerprint(path);
        if (!existing.exists) {
            return {
                artifactKey: input.artifactKey,
                absolutePath: path,
                type: codegen_output_contracts_1.CodeGenConflictType.NONE,
                policy: input.policy,
                allowed: true,
                reason: "Target file does not exist",
                existingFingerprint: existing,
                expectedFingerprint: this.fingerprints
                    .fingerprintContent(path, input.content),
                detectedAt: new Date().toISOString(),
            };
        }
        if (input.policy ===
            codegen_output_contracts_1.CodeGenConflictPolicy.SKIP) {
            return {
                artifactKey: input.artifactKey,
                absolutePath: path,
                type: codegen_output_contracts_1.CodeGenConflictType.FILE_EXISTS,
                policy: input.policy,
                allowed: true,
                reason: "Existing file will be skipped",
                existingFingerprint: existing,
                detectedAt: new Date().toISOString(),
            };
        }
        if (input.policy ===
            codegen_output_contracts_1.CodeGenConflictPolicy.OVERWRITE) {
            return {
                artifactKey: input.artifactKey,
                absolutePath: path,
                type: codegen_output_contracts_1.CodeGenConflictType.FILE_EXISTS,
                policy: input.policy,
                allowed: true,
                reason: "Overwrite policy allows replacement",
                existingFingerprint: existing,
                expectedFingerprint: this.fingerprints
                    .fingerprintContent(path, input.content),
                detectedAt: new Date().toISOString(),
            };
        }
        if (input.policy ===
            codegen_output_contracts_1.CodeGenConflictPolicy.OVERWRITE_IF_UNCHANGED) {
            if (!input.expectedChecksum) {
                throw new codegen_errors_1.CodeGenValidationError(`Expected checksum is required for overwrite_if_unchanged: ${path}`);
            }
            const unchanged = existing.checksum ===
                input.expectedChecksum;
            return {
                artifactKey: input.artifactKey,
                absolutePath: path,
                type: unchanged
                    ? codegen_output_contracts_1.CodeGenConflictType.FILE_EXISTS
                    : codegen_output_contracts_1.CodeGenConflictType.CONTENT_CHANGED,
                policy: input.policy,
                allowed: unchanged,
                reason: unchanged
                    ? "Existing file matches expected checksum"
                    : "Existing file was modified outside CodeGen",
                existingFingerprint: existing,
                expectedFingerprint: this.fingerprints
                    .fingerprintContent(path, input.content),
                detectedAt: new Date().toISOString(),
            };
        }
        return {
            artifactKey: input.artifactKey,
            absolutePath: path,
            type: codegen_output_contracts_1.CodeGenConflictType.FILE_EXISTS,
            policy: input.policy,
            allowed: false,
            reason: "Existing file conflicts with error policy",
            existingFingerprint: existing,
            detectedAt: new Date().toISOString(),
        };
    }
}
exports.CodeGenOutputConflictDetector = CodeGenOutputConflictDetector;
//# sourceMappingURL=codegen-output-conflict-detector.js.map