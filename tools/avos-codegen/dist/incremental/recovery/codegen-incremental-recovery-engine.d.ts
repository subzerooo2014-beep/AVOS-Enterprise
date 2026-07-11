import { CodeGenIncrementalRun } from "../contracts/codegen-incremental.contracts";
import { CodeGenIncrementalSnapshotStore } from "../persistence/codegen-incremental-snapshot-store";
export declare class CodeGenIncrementalRecoveryEngine {
    readonly snapshots: CodeGenIncrementalSnapshotStore;
    constructor(snapshots?: CodeGenIncrementalSnapshotStore);
    recover(run: CodeGenIncrementalRun): Promise<CodeGenIncrementalRun>;
}
//# sourceMappingURL=codegen-incremental-recovery-engine.d.ts.map