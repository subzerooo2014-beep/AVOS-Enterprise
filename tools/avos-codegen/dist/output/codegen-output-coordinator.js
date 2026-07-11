"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenOutputCoordinator = void 0;
const node_path_1 = require("node:path");
const codegen_errors_1 = require("../core/codegen.errors");
const codegen_atomic_file_writer_1 = require("./atomic/codegen-atomic-file-writer");
const codegen_output_conflict_detector_1 = require("./conflicts/codegen-output-conflict-detector");
const codegen_output_integrity_verifier_1 = require("./integrity/codegen-output-integrity-verifier");
const codegen_workspace_lock_manager_1 = require("./locking/codegen-workspace-lock-manager");
const codegen_output_manifest_engine_1 = require("./manifests/codegen-output-manifest-engine");
const codegen_generation_report_engine_1 = require("./reports/codegen-generation-report-engine");
const codegen_output_contracts_1 = require("./codegen-output.contracts");
class CodeGenOutputCoordinator {
    writer;
    conflicts;
    locks;
    manifests;
    integrity;
    reports;
    constructor(writer = new codegen_atomic_file_writer_1.CodeGenAtomicFileWriter(), conflicts = new codegen_output_conflict_detector_1.CodeGenOutputConflictDetector(), locks = new codegen_workspace_lock_manager_1.CodeGenWorkspaceLockManager(), manifests = new codegen_output_manifest_engine_1.CodeGenOutputManifestEngine(), integrity = new codegen_output_integrity_verifier_1.CodeGenOutputIntegrityVerifier(), reports = new codegen_generation_report_engine_1.CodeGenGenerationReportEngine()) {
        this.writer = writer;
        this.conflicts = conflicts;
        this.locks = locks;
        this.manifests = manifests;
        this.integrity = integrity;
        this.reports = reports;
    }
    async execute(input) {
        const started = Date.now();
        const startedAt = new Date(started).toISOString();
        const warnings = [];
        const errors = [];
        const entries = [];
        const lock = await this.locks.acquire(input.workspaceRoot);
        try {
            for (const artifact of input.artifacts) {
                const absolutePath = (0, node_path_1.resolve)(input.targetRoot, artifact.relativePath);
                const conflict = await this.conflicts.detect({
                    artifactKey: artifact.key,
                    targetRoot: input.targetRoot,
                    absolutePath,
                    content: artifact.content,
                    policy: input.conflictPolicy,
                });
                if (!conflict.allowed) {
                    errors.push(`${artifact.key}: ${conflict.reason}`);
                    throw new codegen_errors_1.CodeGenValidationError(`Output conflict for ${artifact.key}: ${conflict.reason}`);
                }
                if (conflict.type !== "none" &&
                    input.conflictPolicy ===
                        codegen_output_contracts_1.CodeGenConflictPolicy.SKIP) {
                    entries.push({
                        artifactKey: artifact.key,
                        relativePath: artifact.relativePath,
                        absolutePath,
                        checksum: conflict.existingFingerprint
                            ?.checksum ?? "",
                        bytes: conflict.existingFingerprint
                            ?.sizeBytes ?? 0,
                        status: input.dryRun
                            ? "preview"
                            : "skipped",
                        generatedAt: new Date().toISOString(),
                    });
                    warnings.push(`Skipped existing artifact: ${artifact.key}`);
                    continue;
                }
                if (input.dryRun) {
                    entries.push({
                        artifactKey: artifact.key,
                        relativePath: artifact.relativePath,
                        absolutePath,
                        checksum: conflict.expectedFingerprint
                            ?.checksum ?? "",
                        bytes: conflict.expectedFingerprint
                            ?.sizeBytes ?? 0,
                        status: "preview",
                        generatedAt: new Date().toISOString(),
                    });
                    continue;
                }
                const result = await this.writer.write({
                    absolutePath,
                    content: artifact.content,
                });
                entries.push({
                    artifactKey: artifact.key,
                    relativePath: artifact.relativePath,
                    absolutePath,
                    checksum: result.checksum,
                    bytes: result.bytes,
                    status: "written",
                    generatedAt: result.writtenAt,
                });
            }
            const manifest = this.manifests.create({
                sessionId: input.sessionId,
                workspaceRoot: input.workspaceRoot,
                targetRoot: input.targetRoot,
                entries,
            });
            let manifestPath;
            let integrityValid = true;
            if (!input.dryRun) {
                manifestPath =
                    await this.manifests.write(manifest);
                const integrity = await this.integrity.verify(manifest);
                integrityValid =
                    integrity.valid;
                if (!integrity.valid) {
                    errors.push("Output integrity verification failed");
                }
            }
            const completed = Date.now();
            const report = {
                sessionId: input.sessionId,
                success: errors.length === 0 &&
                    integrityValid,
                dryRun: input.dryRun,
                artifacts: input.artifacts.length,
                written: entries.filter((entry) => entry.status ===
                    "written").length,
                skipped: entries.filter((entry) => entry.status ===
                    "skipped").length,
                conflicts: warnings.filter((warning) => warning.includes("Skipped")).length,
                integrityValid,
                ...(manifestPath
                    ? {
                        manifestPath,
                    }
                    : {}),
                startedAt,
                completedAt: new Date(completed).toISOString(),
                durationMs: completed - started,
                warnings,
                errors,
            };
            if (!input.dryRun) {
                const reportPath = await this.reports.write(report, input.targetRoot);
                report.reportPath =
                    reportPath;
            }
            return {
                manifest,
                report,
            };
        }
        finally {
            await this.locks.release(lock);
        }
    }
}
exports.CodeGenOutputCoordinator = CodeGenOutputCoordinator;
//# sourceMappingURL=codegen-output-coordinator.js.map