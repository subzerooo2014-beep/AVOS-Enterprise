import {
  CodeGenValidationError,
} from "../../../core/codegen.errors";
import {
  CodeGenExecutionTask,
  CodeGenExecutionTaskStatus,
} from "../contracts/codegen-execution-task.contracts";

export class CodeGenPriorityTaskQueue {
  private readonly tasks =
    new Map<
      string,
      CodeGenExecutionTask
    >();

  enqueue(
    task: CodeGenExecutionTask,
  ): CodeGenExecutionTask {
    if (
      this.tasks.has(
        task.id,
      )
    ) {
      throw new CodeGenValidationError(
        `Execution task already exists: ${task.id}`,
      );
    }

    const queued:
      CodeGenExecutionTask = {
      ...structuredClone(task),
      status:
        CodeGenExecutionTaskStatus.QUEUED,
      updatedAt:
        new Date().toISOString(),
    };

    this.tasks.set(
      task.id,
      queued,
    );

    return structuredClone(
      queued,
    );
  }

  dequeueReady(
    completedKeys:
      ReadonlySet<string>,
  ):
    CodeGenExecutionTask |
    undefined {
    const ready =
      this.list()
        .filter(
          (task) =>
            task.status ===
              CodeGenExecutionTaskStatus.QUEUED &&
            task.dependencies.every(
              (dependencyKey) =>
                completedKeys.has(
                  dependencyKey,
                ),
            ),
        )
        .sort(
          (left, right) =>
            right.priority -
              left.priority ||
            left.createdAt.localeCompare(
              right.createdAt,
            ),
        )[0];

    if (!ready) {
      return undefined;
    }

    ready.status =
      CodeGenExecutionTaskStatus.DISPATCHED;

    ready.updatedAt =
      new Date().toISOString();

    this.tasks.set(
      ready.id,
      structuredClone(ready),
    );

    return ready;
  }

  update(
    task:
      CodeGenExecutionTask,
  ): CodeGenExecutionTask {
    if (
      !this.tasks.has(
        task.id,
      )
    ) {
      throw new CodeGenValidationError(
        `Execution task was not found: ${task.id}`,
      );
    }

    const updated = {
      ...structuredClone(task),
      updatedAt:
        new Date().toISOString(),
    };

    this.tasks.set(
      task.id,
      updated,
    );

    return structuredClone(
      updated,
    );
  }

  get(
    taskId: string,
  ): CodeGenExecutionTask {
    const task =
      this.tasks.get(
        taskId,
      );

    if (!task) {
      throw new CodeGenValidationError(
        `Execution task was not found: ${taskId}`,
      );
    }

    return structuredClone(
      task,
    );
  }

  list():
    CodeGenExecutionTask[] {
    return Array.from(
      this.tasks.values(),
    )
      .map(
        (task) =>
          structuredClone(task),
      )
      .sort(
        (left, right) =>
          right.priority -
            left.priority ||
          left.createdAt.localeCompare(
            right.createdAt,
          ),
      );
  }

  hasPending(): boolean {
    return this.list()
      .some(
        (task) =>
          [
            CodeGenExecutionTaskStatus.CREATED,
            CodeGenExecutionTaskStatus.QUEUED,
            CodeGenExecutionTaskStatus.DISPATCHED,
            CodeGenExecutionTaskStatus.RUNNING,
          ].includes(
            task.status,
          ),
      );
  }

  clear(): void {
    this.tasks.clear();
  }
}
