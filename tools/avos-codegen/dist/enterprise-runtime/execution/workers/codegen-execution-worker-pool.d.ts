import { CodeGenExecutionWorker } from "./codegen-execution-worker.contracts";
export declare class CodeGenExecutionWorkerPool {
    readonly maximumWorkers: number;
    private readonly workers;
    constructor(maximumWorkers?: number);
    acquire(): CodeGenExecutionWorker | undefined;
    get(workerId: string): CodeGenExecutionWorker;
    list(): CodeGenExecutionWorker[];
    stopAll(): void;
    private getMutable;
}
//# sourceMappingURL=codegen-execution-worker-pool.d.ts.map