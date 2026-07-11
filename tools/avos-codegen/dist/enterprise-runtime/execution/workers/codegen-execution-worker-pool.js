"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenExecutionWorkerPool = void 0;
const node_crypto_1 = require("node:crypto");
const codegen_errors_1 = require("../../../core/codegen.errors");
const codegen_execution_worker_contracts_1 = require("./codegen-execution-worker.contracts");
class CodeGenExecutionWorkerPool {
    maximumWorkers;
    workers = new Map();
    constructor(maximumWorkers = 4) {
        this.maximumWorkers = maximumWorkers;
        const count = Math.max(1, maximumWorkers);
        for (let index = 0; index < count; index += 1) {
            const now = new Date().toISOString();
            const worker = {
                id: (0, node_crypto_1.randomUUID)(),
                status: codegen_execution_worker_contracts_1.CodeGenExecutionWorkerStatus.IDLE,
                completedTasks: 0,
                failedTasks: 0,
                createdAt: now,
                updatedAt: now,
            };
            this.workers.set(worker.id, worker);
        }
    }
    acquire() {
        const worker = this.list()
            .find((candidate) => candidate.status ===
            codegen_execution_worker_contracts_1.CodeGenExecutionWorkerStatus.IDLE);
        return worker
            ? this.getMutable(worker.id)
            : undefined;
    }
    get(workerId) {
        const worker = this.workers.get(workerId);
        if (!worker) {
            throw new codegen_errors_1.CodeGenValidationError(`Execution worker was not found: ${workerId}`);
        }
        return structuredClone(worker);
    }
    list() {
        return Array.from(this.workers.values())
            .map((worker) => structuredClone(worker));
    }
    stopAll() {
        for (const worker of this.workers.values()) {
            worker.status =
                codegen_execution_worker_contracts_1.CodeGenExecutionWorkerStatus.STOPPED;
            worker.updatedAt =
                new Date().toISOString();
        }
    }
    getMutable(workerId) {
        const worker = this.workers.get(workerId);
        if (!worker) {
            throw new codegen_errors_1.CodeGenValidationError(`Execution worker was not found: ${workerId}`);
        }
        return worker;
    }
}
exports.CodeGenExecutionWorkerPool = CodeGenExecutionWorkerPool;
//# sourceMappingURL=codegen-execution-worker-pool.js.map