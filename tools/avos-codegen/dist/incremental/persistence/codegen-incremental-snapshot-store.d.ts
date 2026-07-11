import { CodeGenIncrementalSnapshot } from "../contracts/codegen-incremental.contracts";
export declare class CodeGenIncrementalSnapshotStore {
    load(snapshotPath: string): Promise<CodeGenIncrementalSnapshot | undefined>;
    save(snapshotPath: string, snapshot: CodeGenIncrementalSnapshot): Promise<string>;
}
//# sourceMappingURL=codegen-incremental-snapshot-store.d.ts.map