import {
  CodeGenExecutionBatchResult,
  CodeGenExecutionTask,
  CodeGenExecutionTaskResult,
  CodeGenExecutionTaskStatus,
} from "../contracts/codegen-execution-task.contracts";
import {
  CodeGenPriorityTaskQueue,
} from "../queue/codegen-priority-task-queue";
import {
  CodeGenDefaultWorkerExecutor,
} from "../workers/codegen-default-worker-executor";
import {
  CodeGenExecutionWorkerPool,
} from "../workers/codegen-execution-worker-pool";

export class CodeGenParallelExecutionEngine {
  constructor(
    readonly queue =
      new CodeGenPriorityTaskQueue(),
    readonly pool =
      new CodeGenExecutionWorkerPool(
        4,
      ),
    readonly executor =
      new CodeGenDefaultWorkerExecutor(),
  ) {}

  async execute(
    tasks:
      readonly CodeGenExecutionTask[],
  ): Promise<
    CodeGenExecutionBatchResult
  > {
    const startedAt =
      new Date().toISOString();

    for (const task of tasks) {
      this.queue.enqueue(
        task,
      );
    }

    const completedKeys =
      new Set<string>();

    const results:
      CodeGenExecutionTaskResult[] =
      [];

    while (
      this.queue.hasPending()
    ) {
      const running:
        Promise<void>[] =
        [];

      while (true) {
        const worker =
          this.pool.acquire();

        if (!worker) {
          break;
        }

        const task =
          this.queue.dequeueReady(
            completedKeys,
          );

        if (!task) {
          break;
        }

        running.push(
          this.runTask(
            worker.id,
            task,
            completedKeys,
            results,
          ),
        );
      }

      if (
        running.length === 0
      ) {
        const blocked =
          this.queue.list()
            .filter(
              (task) =>
                task.status ===
                CodeGenExecutionTaskStatus.QUEUED,
            );

        for (const task of blocked) {
          task.status =
            CodeGenExecutionTaskStatus.SKIPPED;

          this.queue.update(
            task,
          );

          const now =
            new Date().toISOString();

          results.push({
            taskId:
              task.id,
            taskKey:
              task.key,
            workerId:
              "none",
            success: false,
            skipped: true,
            error:
              "Task dependencies could not be satisfied",
            startedAt:
              now,
            completedAt:
              now,
            durationMs: 0,
            metadata: {},
          });
        }

        break;
      }

      await Promise.all(
        running,
      );
    }

    const completedAt =
      new Date().toISOString();

    const succeeded =
      results.filter(
        (result) =>
          result.success &&
          !result.skipped,
      ).length;

    const failed =
      results.filter(
        (result) =>
          !result.success &&
          !result.skipped,
      ).length;

    const skipped =
      results.filter(
        (result) =>
          result.skipped,
      ).length;

    return {
      success:
        failed === 0 &&
        skipped === 0,
      results,
      succeeded,
      failed,
      skipped,
      cancelled: 0,
      startedAt,
      completedAt,
      durationMs:
        Date.parse(
          completedAt,
        ) -
        Date.parse(
          startedAt,
        ),
    };
  }

  private async runTask(
    workerId: string,
    task:
      CodeGenExecutionTask,
    completedKeys:
      Set<string>,
    results:
      CodeGenExecutionTaskResult[],
  ): Promise<void> {
    const worker =
      this.pool.acquire();

    if (
      !worker ||
      worker.id !==
      workerId
    ) {
      return;
    }

    const result =
      await this.executor.execute(
        worker,
        task,
      );

    task.status =
      result.success
        ? CodeGenExecutionTaskStatus.SUCCEEDED
        : CodeGenExecutionTaskStatus.FAILED;

    task.updatedAt =
      new Date().toISOString();

    this.queue.update(
      task,
    );

    if (result.success) {
      completedKeys.add(
        task.key,
      );
    }

    results.push(
      result,
    );
  }
}
