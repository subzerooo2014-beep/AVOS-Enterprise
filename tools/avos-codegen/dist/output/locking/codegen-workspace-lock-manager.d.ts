import { CodeGenWorkspaceLock } from "../codegen-output.contracts";
export declare class CodeGenWorkspaceLockManager {
    acquire(workspaceRoot: string, ttlMs?: number): Promise<CodeGenWorkspaceLock>;
    release(lock: CodeGenWorkspaceLock): Promise<void>;
    private read;
}
//# sourceMappingURL=codegen-workspace-lock-manager.d.ts.map