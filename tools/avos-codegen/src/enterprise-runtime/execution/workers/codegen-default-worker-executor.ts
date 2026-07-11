import {
  CodeGenExecutionTaskStatus,
} from "../contracts/codegen-execution-task.contracts";
import {
  CodeGenExecutionTaskHandlerRegistry,
} from "../runtime/codegen-execution-task-handler-registry";
import {
  CodeGenExecutionWorker,
  CodeGenExecutionWorkerExecutor,
  CodeGenExecutionWorkerStatus,
} from "./codegen-execution-worker.contracts";
import {
  CodeGenExecutionTask,
  CodeGenExecutionTaskResult,
} from "../contracts/codegen-execution-task.contracts";

export class CodeGenDefaultWorkerExecutor
  implements CodeGenExecutionWorkerExecutor {
  constructor(
    readonly handlers =
      new CodeGenExecutionTaskHandlerRegistry(),
  ) {}

  async execute(
    worker:
      CodeGenExecutionWorker,
    task:
      CodeGenExecutionTask,
  ): Promise<
    CodeGenExecutionTaskResult
  > {
    worker.status =
      CodeGenExecutionWorkerStatus.BUSY;

    worker.currentTaskId =
      task.id;

    worker.updatedAt =
      new Date().toISOString();

    task.status =
      CodeGenExecutionTaskStatus.RUNNING;

    task.attempts += 1;

    task.updatedAt =
      new Date().toISOString();

    try {
      const handler =
        this.handlers.get(
          task.type,
        );

      const result =
        await handler.execute({
          task,
          workerId:
            worker.id,
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
    } catch (error) {
      const completedAt =
        new Date().toISOString();

      worker.failedTasks += 1;

      return {
        taskId:
          task.id,
        taskKey:
          task.key,
        workerId:
          worker.id,
        success: false,
        skipped: false,
        error:
          error instanceof Error
            ? error.message
            : String(error),
        startedAt:
          task.updatedAt,
        completedAt,
        durationMs:
          Date.parse(
            completedAt,
          ) -
          Date.parse(
            task.updatedAt,
          ),
        metadata: {},
      };
    } finally {
      worker.status =
        CodeGenExecutionWorkerStatus.IDLE;

      delete worker.currentTaskId;

      worker.updatedAt =
        new Date().toISOString();
    }
  }
}
