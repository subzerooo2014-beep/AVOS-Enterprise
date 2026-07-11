import { CodeGenRollbackResult, CodeGenRollbackStep } from "./codegen-rollback.contracts";
export interface CodeGenRollbackHandler {
    readonly key: string;
    execute(step: CodeGenRollbackStep): Promise<void>;
}
export declare class CodeGenRollbackEngine {
    private readonly handlers;
    register(handler: CodeGenRollbackHandler, replace?: boolean): CodeGenRollbackHandler;
    execute(steps: readonly CodeGenRollbackStep[]): Promise<CodeGenRollbackResult>;
}
//# sourceMappingURL=codegen-rollback-engine.d.ts.map