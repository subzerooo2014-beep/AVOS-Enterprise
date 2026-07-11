import {
  randomUUID,
} from "node:crypto";
import {
  CodeGenValidationError,
} from "../../../core/codegen.errors";
import {
  CodeGenExecutionWorker,
  CodeGenExecutionWorkerStatus,
} from "./codegen-execution-worker.contracts";

export class CodeGenExecutionWorkerPool {
  private readonly workers =
    new Map<
      string,
      CodeGenExecutionWorker
    >();

  constructor(
    readonly maximumWorkers = 4,
  ) {
    const count =
      Math.max(
        1,
        maximumWorkers,
      );

    for (
      let index = 0;
      index < count;
      index += 1
    ) {
      const now =
        new Date().toISOString();

      const worker:
        CodeGenExecutionWorker = {
        id:
          randomUUID(),
        status:
          CodeGenExecutionWorkerStatus.IDLE,
        completedTasks: 0,
        failedTasks: 0,
        createdAt:
          now,
        updatedAt:
          now,
      };

      this.workers.set(
        worker.id,
        worker,
      );
    }
  }

  acquire():
    CodeGenExecutionWorker |
    undefined {
    const worker =
      this.list()
        .find(
          (candidate) =>
            candidate.status ===
            CodeGenExecutionWorkerStatus.IDLE,
        );

    return worker
      ? this.getMutable(
          worker.id,
        )
      : undefined;
  }

  get(
    workerId: string,
  ): CodeGenExecutionWorker {
    const worker =
      this.workers.get(
        workerId,
      );

    if (!worker) {
      throw new CodeGenValidationError(
        `Execution worker was not found: ${workerId}`,
      );
    }

    return structuredClone(
      worker,
    );
  }

  list():
    CodeGenExecutionWorker[] {
    return Array.from(
      this.workers.values(),
    )
      .map(
        (worker) =>
          structuredClone(worker),
      );
  }

  stopAll(): void {
    for (
      const worker of
      this.workers.values()
    ) {
      worker.status =
        CodeGenExecutionWorkerStatus.STOPPED;

      worker.updatedAt =
        new Date().toISOString();
    }
  }

  private getMutable(
    workerId: string,
  ): CodeGenExecutionWorker {
    const worker =
      this.workers.get(
        workerId,
      );

    if (!worker) {
      throw new CodeGenValidationError(
        `Execution worker was not found: ${workerId}`,
      );
    }

    return worker;
  }
}
