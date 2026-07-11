"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenDefaultWorkerExecutor = void 0;
const codegen_execution_task_contracts_1 = require("../contracts/codegen-execution-task.contracts");
const codegen_execution_task_handler_registry_1 = require("../runtime/codegen-execution-task-handler-registry");
const codegen_execution_worker_contracts_1 = require("./codegen-execution-worker.contracts");
class CodeGenDefaultWorkerExecutor {
    handlers;
    constructor(handlers = new codegen_execution_task_handler_registry_1.CodeGenExecutionTaskHandlerRegistry()) {
        this.handlers = handlers;
    }
    async execute(worker, task) {
        worker.status =
            codegen_execution_worker_contracts_1.CodeGenExecutionWorkerStatus.BUSY;
        worker.currentTaskId =
            task.id;
        worker.updatedAt =
            new Date().toISOString();
        task.status =
            codegen_execution_task_contracts_1.CodeGenExecutionTaskStatus.RUNNING;
        task.attempts += 1;
        task.updatedAt =
            new Date().toISOString();
        try {
            const handler = this.handlers.get(task.type);
            const result = await handler.execute({
                task,
                workerId: worker.id,
            });
            worker.completedTasks +=
                result.success
                    ? 1
                    : 0;
            worker.failedTasks +=
                result.success
                    ? 0
                    : 1;
            return result;
        }
        catch (error) {
            const completedAt = new Date().toISOString();
            worker.failedTasks += 1;
            return {
                taskId: task.id,
                taskKey: task.key,
                workerId: worker.id,
                success: false,
                skipped: false,
                error: error instanceof Error
                    ? error.message
                    : String(error),
                startedAt: task.updatedAt,
                completedAt,
                durationMs: Date.parse(completedAt) -
                    Date.parse(task.updatedAt),
                metadata: {},
            };
        }
        finally {
            worker.status =
                codegen_execution_worker_contracts_1.CodeGenExecutionWorkerStatus.IDLE;
            delete worker.currentTaskId;
            worker.updatedAt =
                new Date().toISOString();
        }
    }
}
exports.CodeGenDefaultWorkerExecutor = CodeGenDefaultWorkerExecutor;
//# sourceMappingURL=codegen-default-worker-executor.js.map