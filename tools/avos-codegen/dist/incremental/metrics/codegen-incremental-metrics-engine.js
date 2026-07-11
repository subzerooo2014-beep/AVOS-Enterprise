"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenIncrementalMetricsEngine = void 0;
const codegen_incremental_contracts_1 = require("../contracts/codegen-incremental.contracts");
class CodeGenIncrementalMetricsEngine {
    calculate(run, startedAt) {
        const items = run.plan?.items ?? [];
        const artifacts = run.changes.length;
        const skipped = items.filter((item) => item.decision ===
            codegen_incremental_contracts_1.CodeGenRegenerationDecision.SKIP).length;
        const generated = items.filter((item) => item.decision ===
            codegen_incremental_contracts_1.CodeGenRegenerationDecision.GENERATE).length;
        const regenerated = items.filter((item) => item.decision ===
            codegen_incremental_contracts_1.CodeGenRegenerationDecision.REGENERATE).length;
        return {
            artifacts,
            created: run.changes.filter((change) => change.type ===
                codegen_incremental_contracts_1.CodeGenArtifactChangeType.CREATED).length,
            modified: run.changes.filter((change) => change.type ===
                codegen_incremental_contracts_1.CodeGenArtifactChangeType.MODIFIED ||
                change.type ===
                    codegen_incremental_contracts_1.CodeGenArtifactChangeType.MOVED).length,
            unchanged: run.changes.filter((change) => change.type ===
                codegen_incremental_contracts_1.CodeGenArtifactChangeType.UNCHANGED).length,
            deleted: run.changes.filter((change) => change.type ===
                codegen_incremental_contracts_1.CodeGenArtifactChangeType.DELETED).length,
            conflicted: run.changes.filter((change) => change.type ===
                codegen_incremental_contracts_1.CodeGenArtifactChangeType.CONFLICTED).length,
            generated,
            regenerated,
            skipped,
            savedWorkRatio: artifacts === 0
                ? 1
                : skipped /
                    artifacts,
            durationMs: Date.now() -
                Date.parse(startedAt),
            generatedAt: new Date().toISOString(),
        };
    }
}
exports.CodeGenIncrementalMetricsEngine = CodeGenIncrementalMetricsEngine;
//# sourceMappingURL=codegen-incremental-metrics-engine.js.map