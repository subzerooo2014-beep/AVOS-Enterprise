export interface CodeGenExecutionProgress {
    total: number;
    completed: number;
    failed: number;
    skipped: number;
    running: number;
    pending: number;
    percentage: number;
    startedAt: string;
    updatedAt: string;
    estimatedRemainingMs?: number;
}
export interface CodeGenProgressUpdate {
    completed?: number;
    failed?: number;
    skipped?: number;
    running?: number;
    pending?: number;
}
//# sourceMappingURL=codegen-progress.contracts.d.ts.map