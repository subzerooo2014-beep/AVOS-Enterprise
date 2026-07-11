import { CodeGenExecutionProgress, CodeGenProgressUpdate } from "./codegen-progress.contracts";
export declare class CodeGenExecutionProgressTracker {
    private readonly progress;
    constructor(total: number);
    update(input: CodeGenProgressUpdate): CodeGenExecutionProgress;
    incrementCompleted(): CodeGenExecutionProgress;
    incrementFailed(): CodeGenExecutionProgress;
    snapshot(): CodeGenExecutionProgress;
}
//# sourceMappingURL=codegen-execution-progress-tracker.d.ts.map