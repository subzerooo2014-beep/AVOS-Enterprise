"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenPriorityTaskQueue = void 0;
const codegen_errors_1 = require("../../../core/codegen.errors");
const codegen_execution_task_contracts_1 = require("../contracts/codegen-execution-task.contracts");
class CodeGenPriorityTaskQueue {
    tasks = new Map();
    enqueue(task) {
        if (this.tasks.has(task.id)) {
            throw new codegen_errors_1.CodeGenValidationError(`Execution task already exists: ${task.id}`);
        }
        const queued = {
            ...structuredClone(task),
            status: codegen_execution_task_contracts_1.CodeGenExecutionTaskStatus.QUEUED,
            updatedAt: new Date().toISOString(),
        };
        this.tasks.set(task.id, queued);
        return structuredClone(queued);
    }
    dequeueReady(completedKeys) {
        const ready = this.list()
            .filter((task) => task.status ===
            codegen_execution_task_contracts_1.CodeGenExecutionTaskStatus.QUEUED &&
            task.dependencies.every((dependencyKey) => completedKeys.has(dependencyKey)))
            .sort((left, right) => right.priority -
            left.priority ||
            left.createdAt.localeCompare(right.createdAt))[0];
        if (!ready) {
            return undefined;
        }
        ready.status =
            codegen_execution_task_contracts_1.CodeGenExecutionTaskStatus.DISPATCHED;
        ready.updatedAt =
            new Date().toISOString();
        this.tasks.set(ready.id, structuredClone(ready));
        return ready;
    }
    update(task) {
        if (!this.tasks.has(task.id)) {
            throw new codegen_errors_1.CodeGenValidationError(`Execution task was not found: ${task.id}`);
        }
        const updated = {
            ...structuredClone(task),
            updatedAt: new Date().toISOString(),
        };
        this.tasks.set(task.id, updated);
        return structuredClone(updated);
    }
    get(taskId) {
        const task = this.tasks.get(taskId);
        if (!task) {
            throw new codegen_errors_1.CodeGenValidationError(`Execution task was not found: ${taskId}`);
        }
        return structuredClone(task);
    }
    list() {
        return Array.from(this.tasks.values())
            .map((task) => structuredClone(task))
            .sort((left, right) => right.priority -
            left.priority ||
            left.createdAt.localeCompare(right.createdAt));
    }
    hasPending() {
        return this.list()
            .some((task) => [
            codegen_execution_task_contracts_1.CodeGenExecutionTaskStatus.CREATED,
            codegen_execution_task_contracts_1.CodeGenExecutionTaskStatus.QUEUED,
            codegen_execution_task_contracts_1.CodeGenExecutionTaskStatus.DISPATCHED,
            codegen_execution_task_contracts_1.CodeGenExecutionTaskStatus.RUNNING,
        ].includes(task.status));
    }
    clear() {
        this.tasks.clear();
    }
}
exports.CodeGenPriorityTaskQueue = CodeGenPriorityTaskQueue;
//# sourceMappingURL=codegen-priority-task-queue.js.map