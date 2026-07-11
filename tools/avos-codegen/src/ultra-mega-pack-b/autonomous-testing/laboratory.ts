import {
  AutonomousTestCase,
  AutonomousTestExecution,
  AutonomousTestingReport,
} from "./contracts";

export interface AutonomousTestHandler {
  readonly kind: AutonomousTestCase["kind"];
  execute(
    test: AutonomousTestCase,
  ):
    | Promise<AutonomousTestExecution>
    | AutonomousTestExecution;
}

export class AutonomousTestingLaboratory {
  private readonly handlers =
    new Map<AutonomousTestCase["kind"], AutonomousTestHandler>();

  register(
    handler: AutonomousTestHandler,
    replace = false,
  ): void {
    if (this.handlers.has(handler.kind) && !replace) {
      throw new Error(
        `Test handler already registered: ${handler.kind}`,
      );
    }

    this.handlers.set(handler.kind, handler);
  }

  async run(
    tests: readonly AutonomousTestCase[],
  ): Promise<AutonomousTestingReport> {
    const executions: AutonomousTestExecution[] = [];

    for (const test of [...tests].sort(
      (left, right) => right.priority - left.priority,
    )) {
      const handler = this.handlers.get(test.kind);

      if (!handler) {
        executions.push({
          testId: test.id,
          passed: false,
          durationMs: 0,
          findings: [],
          executedAt: new Date().toISOString(),
        });
        continue;
      }

      executions.push(
        await handler.execute(test),
      );
    }

    const passedCount =
      executions.filter((item) => item.passed).length;

    return {
      passed:
        executions.length > 0 &&
        passedCount === executions.length,
      score:
        executions.length === 0
          ? 0
          : Math.round(
              (passedCount / executions.length) * 100,
            ),
      executions,
      generatedAt: new Date().toISOString(),
    };
  }
}
