import {
  CodeGenRollbackResult,
  CodeGenRollbackStep,
  CodeGenRollbackStepResult,
  CodeGenRollbackStepStatus,
} from "./codegen-rollback.contracts";

export interface CodeGenRollbackHandler {
  readonly key: string;

  execute(
    step:
      CodeGenRollbackStep,
  ): Promise<void>;
}

export class CodeGenRollbackEngine {
  private readonly handlers =
    new Map<
      string,
      CodeGenRollbackHandler
    >();

  register(
    handler:
      CodeGenRollbackHandler,
    replace = false,
  ): CodeGenRollbackHandler {
    if (
      this.handlers.has(
        handler.key,
      ) &&
      !replace
    ) {
      throw new Error(
        `Rollback handler already exists: ${handler.key}`,
      );
    }

    this.handlers.set(
      handler.key,
      handler,
    );

    return handler;
  }

  async execute(
    steps:
      readonly CodeGenRollbackStep[],
  ): Promise<
    CodeGenRollbackResult
  > {
    const startedAt =
      new Date().toISOString();

    const ordered =
      [...steps]
        .sort(
          (left, right) =>
            right.priority -
            left.priority,
        );

    const results:
      CodeGenRollbackStepResult[] =
      [];

    for (const step of ordered) {
      const stepStartedAt =
        new Date().toISOString();

      const handler =
        this.handlers.get(
          step.key,
        );

      if (!handler) {
        step.status =
          CodeGenRollbackStepStatus.SKIPPED;

        const completedAt =
          new Date().toISOString();

        results.push({
          stepId:
            step.id,
          stepKey:
            step.key,
          success: false,
          error:
            `Rollback handler was not found: ${step.key}`,
          startedAt:
            stepStartedAt,
          completedAt,
          durationMs:
            Date.parse(
              completedAt,
            ) -
            Date.parse(
              stepStartedAt,
            ),
        });

        continue;
      }

      try {
        step.status =
          CodeGenRollbackStepStatus.RUNNING;

        await handler.execute(
          step,
        );

        step.status =
          CodeGenRollbackStepStatus.SUCCEEDED;

        const completedAt =
          new Date().toISOString();

        results.push({
          stepId:
            step.id,
          stepKey:
            step.key,
          success: true,
          startedAt:
            stepStartedAt,
          completedAt,
          durationMs:
            Date.parse(
              completedAt,
            ) -
            Date.parse(
              stepStartedAt,
            ),
        });
      } catch (error) {
        step.status =
          CodeGenRollbackStepStatus.FAILED;

        const completedAt =
          new Date().toISOString();

        results.push({
          stepId:
            step.id,
          stepKey:
            step.key,
          success: false,
          error:
            error instanceof Error
              ? error.message
              : String(error),
          startedAt:
            stepStartedAt,
          completedAt,
          durationMs:
            Date.parse(
              completedAt,
            ) -
            Date.parse(
              stepStartedAt,
            ),
        });
      }
    }

    const completedAt =
      new Date().toISOString();

    const failedSteps =
      results.filter(
        (result) =>
          !result.success,
      ).length;

    return {
      success:
        failedSteps === 0,
      results,
      failedSteps,
      completedSteps:
        results.length -
        failedSteps,
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
}
