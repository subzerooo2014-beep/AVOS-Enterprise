import {
  CodeGenExecutionProgress,
  CodeGenProgressUpdate,
} from "./codegen-progress.contracts";

export class CodeGenExecutionProgressTracker {
  private readonly progress:
    CodeGenExecutionProgress;

  constructor(
    total: number,
  ) {
    const now =
      new Date().toISOString();

    this.progress = {
      total:
        Math.max(
          0,
          total,
        ),
      completed: 0,
      failed: 0,
      skipped: 0,
      running: 0,
      pending:
        Math.max(
          0,
          total,
        ),
      percentage: 0,
      startedAt:
        now,
      updatedAt:
        now,
    };
  }

  update(
    input:
      CodeGenProgressUpdate,
  ): CodeGenExecutionProgress {
    this.progress.completed =
      Math.max(
        0,
        input.completed ??
        this.progress.completed,
      );

    this.progress.failed =
      Math.max(
        0,
        input.failed ??
        this.progress.failed,
      );

    this.progress.skipped =
      Math.max(
        0,
        input.skipped ??
        this.progress.skipped,
      );

    this.progress.running =
      Math.max(
        0,
        input.running ??
        this.progress.running,
      );

    this.progress.pending =
      Math.max(
        0,
        input.pending ??
        this.progress.pending,
      );

    const processed =
      this.progress.completed +
      this.progress.failed +
      this.progress.skipped;

    this.progress.percentage =
      this.progress.total === 0
        ? 100
        : Math.min(
            100,
            Math.round(
              processed /
              this.progress.total *
              100,
            ),
          );

    const now =
      new Date().toISOString();

    this.progress.updatedAt =
      now;

    const elapsed =
      Date.parse(now) -
      Date.parse(
        this.progress.startedAt,
      );

    if (
      processed > 0 &&
      processed <
        this.progress.total
    ) {
      const average =
        elapsed /
        processed;

      this.progress.estimatedRemainingMs =
        Math.round(
          average *
          (
            this.progress.total -
            processed
          ),
        );
    } else {
      delete this.progress
        .estimatedRemainingMs;
    }

    return this.snapshot();
  }

  incrementCompleted():
    CodeGenExecutionProgress {
    return this.update({
      completed:
        this.progress.completed +
        1,
      pending:
        Math.max(
          0,
          this.progress.pending -
          1,
        ),
    });
  }

  incrementFailed():
    CodeGenExecutionProgress {
    return this.update({
      failed:
        this.progress.failed +
        1,
      pending:
        Math.max(
          0,
          this.progress.pending -
          1,
        ),
    });
  }

  snapshot():
    CodeGenExecutionProgress {
    return structuredClone(
      this.progress,
    );
  }
}
