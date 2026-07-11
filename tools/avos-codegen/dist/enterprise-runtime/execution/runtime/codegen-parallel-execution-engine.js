"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenParallelExecutionEngine = void 0;
const codegen_execution_task_contracts_1 = require("../contracts/codegen-execution-task.contracts");
const codegen_priority_task_queue_1 = require("../queue/codegen-priority-task-queue");
const codegen_default_worker_executor_1 = require("../workers/codegen-default-worker-executor");
const codegen_execution_worker_pool_1 = require("../workers/codegen-execution-worker-pool");
class CodeGenParallelExecutionEngine {
    queue;
    pool;
    executor;
    constructor(queue = new codegen_priority_task_queue_1.CodeGenPriorityTaskQueue(), pool = new codegen_execution_worker_pool_1.CodeGenExecutionWorkerPool(4), executor = new codegen_default_worker_executor_1.CodeGenDefaultWorkerExecutor()) {
        this.queue = queue;
        this.pool = pool;
        this.executor = executor;
    }
    async execute(tasks) {
        const startedAt = new Date().toISOString();
        for (const task of tasks) {
            this.queue.enqueue(task);
        }
        const completedKeys = new Set();
        const results = [];
        while (this.queue.hasPending()) {
            const running = [];
            while (true) {
                const worker = this.pool.acquire();
                if (!worker) {
                    break;
                }
                const task = this.queue.dequeueReady(completedKeys);
                if (!task) {
                    break;
                }
                running.push(this.runTask(worker.id, task, completedKeys, results));
            }
            if (running.length === 0) {
                const blocked = this.queue.list()
                    .filter((task) => task.status ===
                    codegen_execution_task_contracts_1.CodeGenExecutionTaskStatus.QUEUED);
                for (const task of blocked) {
                    task.status =
                        codegen_execution_task_contracts_1.CodeGenExecutionTaskStatus.SKIPPED;
                    this.queue.update(task);
                    const now = new Date().toISOString();
                    results.push({
                        taskId: task.id,
                        taskKey: task.key,
                        workerId: "none",
                        success: false,
                        skipped: true,
                        error: "Task dependencies could not be satisfied",
                        startedAt: now,
                        completedAt: now,
                        durationMs: 0,
                        metadata: {},
                    });
                }
                break;
            }
            await Promise.all(running);
        }
        const completedAt = new Date().toISOString();
        const succeeded = results.filter((result) => result.success &&
            !result.skipped).length;
        const failed = results.filter((result) => !result.success &&
            !result.skipped).length;
        const skipped = results.filter((result) => result.skipped).length;
        return {
            success: failed === 0 &&
                skipped === 0,
            results,
            succeeded,
            failed,
            skipped,
            cancelled: 0,
            startedAt,
            completedAt,
            durationMs: Date.parse(completedAt) -
                Date.parse(startedAt),
        };
    }
    async runTask(workerId, task, completedKeys, results) {
        const worker = this.pool.acquire();
        if (!worker ||
            worker.id !==
                workerId) {
            return;
        }
        const result = await this.executor.execute(worker, task);
        task.status =
            result.success
                ? codegen_execution_task_contracts_1.CodeGenExecutionTaskStatus.SUCCEEDED
                : codegen_execution_task_contracts_1.CodeGenExecutionTaskStatus.FAILED;
        task.updatedAt =
            new Date().toISOString();
        this.queue.update(task);
        if (result.success) {
            completedKeys.add(task.key);
        }
        results.push(result);
    }
}
exports.CodeGenParallelExecutionEngine = CodeGenParallelExecutionEngine;
//# sourceMappingURL=codegen-parallel-execution-engine.js.map