"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenIncrementalRecoveryEngine = void 0;
const codegen_incremental_contracts_1 = require("../contracts/codegen-incremental.contracts");
const codegen_incremental_snapshot_store_1 = require("../persistence/codegen-incremental-snapshot-store");
class CodeGenIncrementalRecoveryEngine {
    snapshots;
    constructor(snapshots = new codegen_incremental_snapshot_store_1.CodeGenIncrementalSnapshotStore()) {
        this.snapshots = snapshots;
    }
    async recover(run) {
        const snapshot = await this.snapshots.load(run.snapshotPath);
        if (!snapshot) {
            return {
                ...structuredClone(run),
                status: codegen_incremental_contracts_1.CodeGenIncrementalRunStatus.FAILED,
                errors: [
                    ...run.errors,
                    "Incremental snapshot was not found",
                ],
                updatedAt: new Date().toISOString(),
                completedAt: new Date().toISOString(),
            };
        }
        return {
            ...structuredClone(run),
            status: codegen_incremental_contracts_1.CodeGenIncrementalRunStatus.RECOVERED,
            warnings: [
                ...run.warnings,
                `Recovered snapshot with ${snapshot.artifacts.length} artifacts`,
            ],
            updatedAt: new Date().toISOString(),
            completedAt: new Date().toISOString(),
        };
    }
}
exports.CodeGenIncrementalRecoveryEngine = CodeGenIncrementalRecoveryEngine;
//# sourceMappingURL=codegen-incremental-recovery-engine.js.map