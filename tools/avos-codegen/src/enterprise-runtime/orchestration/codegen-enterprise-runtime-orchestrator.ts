import {
  CodeGenExecutionTaskStatus,
} from "../execution/contracts/codegen-execution-task.contracts";
import {
  CodeGenExecutionTaskFactory,
} from "../execution/runtime/codegen-execution-task-factory";
import {
  CodeGenExecutionTaskHandlerRegistry,
} from "../execution/runtime/codegen-execution-task-handler-registry";
import {
  CodeGenParallelExecutionEngine,
} from "../execution/runtime/codegen-parallel-execution-engine";
import {
  CodeGenPriorityTaskQueue,
} from "../execution/queue/codegen-priority-task-queue";
import {
  CodeGenDefaultWorkerExecutor,
} from "../execution/workers/codegen-default-worker-executor";
import {
  CodeGenExecutionWorkerPool,
} from "../execution/workers/codegen-execution-worker-pool";
import {
  CodeGenRuntimeEventBusV2,
} from "../events-v2/codegen-runtime-event-bus-v2";
import {
  CodeGenExecutionProgressTracker,
} from "../progress/codegen-execution-progress-tracker";
import {
  CodeGenRetryEngineV2,
} from "../resilience/codegen-retry-engine-v2";
import {
  CodeGenRuntimeMetricsAggregator,
} from "../statistics/codegen-runtime-metrics-aggregator";
import {
  CodeGenRuntimePerformanceMonitor,
} from "../telemetry/codegen-runtime-performance-monitor";
import {
  CodeGenRuntimeTelemetryCollector,
} from "../telemetry/codegen-runtime-telemetry-collector";
import {
  registerDefaultExecutionHandlers,
} from "../integration/codegen-execution-handler-bootstrap";
import {
  CodeGenEnterpriseOrchestrationRequest,
  CodeGenEnterpriseOrchestrationResult,
} from "./codegen-enterprise-orchestrator.contracts";

export class CodeGenEnterpriseRuntimeOrchestrator {
  readonly handlers =
    registerDefaultExecutionHandlers(
      new CodeGenExecutionTaskHandlerRegistry(),
    );

  readonly taskFactory =
    new CodeGenExecutionTaskFactory();

  readonly retry =
    new CodeGenRetryEngineV2();

  readonly events =
    new CodeGenRuntimeEventBusV2();

  readonly telemetry =
    new CodeGenRuntimeTelemetryCollector();

  readonly performance =
    new CodeGenRuntimePerformanceMonitor();

  readonly metrics =
    new CodeGenRuntimeMetricsAggregator();

  async execute(
    request:
      CodeGenEnterpriseOrchestrationRequest,
  ): Promise<
    CodeGenEnterpriseOrchestrationResult
  > {
    const startedAt =
      new Date().toISOString();

    const warnings: string[] = [];
    const errors: string[] = [];

    const rootSpan =
      this.telemetry.start(
        "enterprise-runtime-orchestration",
        {
          sessionId:
            request.sessionId,
          artifacts:
            request.artifacts.length,
        },
      );

    await this.events.publish({
      type:
        "enterprise.orchestration.started",
      source:
        "CodeGenEnterpriseRuntimeOrchestrator",
      payload: {
        sessionId:
          request.sessionId,
        artifacts:
          request.artifacts.length,
      },
      metadata:
        request.metadata,
    });

    const progress =
      new CodeGenExecutionProgressTracker(
        request.artifacts.length,
      );

    const tasks =
      this.taskFactory.fromArtifacts(
        request.artifacts,
      );

    const queue =
      new CodeGenPriorityTaskQueue();

    const pool =
      new CodeGenExecutionWorkerPool(
        Math.max(
          1,
          request.maximumWorkers,
        ),
      );

    const executor =
      new CodeGenDefaultWorkerExecutor(
        this.handlers,
      );

    const engine =
      new CodeGenParallelExecutionEngine(
        queue,
        pool,
        executor,
      );

    const batch =
      await this.performance.measure(
        "parallel-execution",
        async () => {
          if (
            !request.enableRetry
          ) {
            return engine.execute(
              tasks,
            );
          }

          const retryResult =
            await this.retry.execute(
              async () => {
                const result =
                  await engine.execute(
                    tasks.map(
                      (task) => ({
                        ...task,
                        status:
                          CodeGenExecutionTaskStatus.CREATED,
                        attempts: 0,
                        updatedAt:
                          new Date().toISOString(),
                      }),
                    ),
                  );

                if (!result.success) {
                  throw new Error(
                    `Parallel execution failed: ${result.failed} failed, ${result.skipped} skipped`,
                  );
                }

                return result;
              },
              {
                maximumAttempts: 2,
                initialDelayMs: 25,
                maximumDelayMs: 100,
                multiplier: 2,
              },
            );

          if (
            retryResult.success &&
            retryResult.value
          ) {
            return retryResult.value;
          }

          throw new Error(
            retryResult.error ??
            "Parallel execution retry failed",
          );
        },
      );

    for (const result of batch.results) {
      if (result.success) {
        progress.incrementCompleted();
      } else if (result.skipped) {
        const snapshot =
          progress.snapshot();

        progress.update({
          skipped:
            snapshot.skipped +
            1,
          pending:
            Math.max(
              0,
              snapshot.pending -
              1,
            ),
        });

        if (result.error) {
          warnings.push(
            result.error,
          );
        }
      } else {
        progress.incrementFailed();

        if (result.error) {
          errors.push(
            result.error,
          );
        }
      }
    }

    const progressSnapshot =
      progress.snapshot();

    this.telemetry.complete(
      rootSpan.id,
      batch.success,
      {
        succeeded:
          batch.succeeded,
        failed:
          batch.failed,
        skipped:
          batch.skipped,
      },
    );

    const telemetrySnapshot =
      this.telemetry.snapshot();

    const metrics =
      this.metrics.aggregate({
        batch,
        progress:
          progressSnapshot,
        telemetry:
          telemetrySnapshot,
        performance:
          this.performance.report(),
      });

    const completedAt =
      new Date().toISOString();

    await this.events.publish({
      type:
        "enterprise.orchestration.completed",
      source:
        "CodeGenEnterpriseRuntimeOrchestrator",
      payload: {
        sessionId:
          request.sessionId,
        success:
          batch.success,
        succeeded:
          batch.succeeded,
        failed:
          batch.failed,
        skipped:
          batch.skipped,
      },
      metadata:
        request.metadata,
    });

    return {
      success:
        batch.success &&
        errors.length === 0,
      sessionId:
        request.sessionId,
      batch,
      progress:
        progressSnapshot,
      telemetry:
        telemetrySnapshot,
      metrics,
      warnings,
      errors,
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
