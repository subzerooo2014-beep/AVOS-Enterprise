"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenEnterpriseRuntimeOrchestrator = void 0;
const codegen_execution_task_contracts_1 = require("../execution/contracts/codegen-execution-task.contracts");
const codegen_execution_task_factory_1 = require("../execution/runtime/codegen-execution-task-factory");
const codegen_execution_task_handler_registry_1 = require("../execution/runtime/codegen-execution-task-handler-registry");
const codegen_parallel_execution_engine_1 = require("../execution/runtime/codegen-parallel-execution-engine");
const codegen_priority_task_queue_1 = require("../execution/queue/codegen-priority-task-queue");
const codegen_default_worker_executor_1 = require("../execution/workers/codegen-default-worker-executor");
const codegen_execution_worker_pool_1 = require("../execution/workers/codegen-execution-worker-pool");
const codegen_runtime_event_bus_v2_1 = require("../events-v2/codegen-runtime-event-bus-v2");
const codegen_execution_progress_tracker_1 = require("../progress/codegen-execution-progress-tracker");
const codegen_retry_engine_v2_1 = require("../resilience/codegen-retry-engine-v2");
const codegen_runtime_metrics_aggregator_1 = require("../statistics/codegen-runtime-metrics-aggregator");
const codegen_runtime_performance_monitor_1 = require("../telemetry/codegen-runtime-performance-monitor");
const codegen_runtime_telemetry_collector_1 = require("../telemetry/codegen-runtime-telemetry-collector");
const codegen_execution_handler_bootstrap_1 = require("../integration/codegen-execution-handler-bootstrap");
class CodeGenEnterpriseRuntimeOrchestrator {
    handlers = (0, codegen_execution_handler_bootstrap_1.registerDefaultExecutionHandlers)(new codegen_execution_task_handler_registry_1.CodeGenExecutionTaskHandlerRegistry());
    taskFactory = new codegen_execution_task_factory_1.CodeGenExecutionTaskFactory();
    retry = new codegen_retry_engine_v2_1.CodeGenRetryEngineV2();
    events = new codegen_runtime_event_bus_v2_1.CodeGenRuntimeEventBusV2();
    telemetry = new codegen_runtime_telemetry_collector_1.CodeGenRuntimeTelemetryCollector();
    performance = new codegen_runtime_performance_monitor_1.CodeGenRuntimePerformanceMonitor();
    metrics = new codegen_runtime_metrics_aggregator_1.CodeGenRuntimeMetricsAggregator();
    async execute(request) {
        const startedAt = new Date().toISOString();
        const warnings = [];
        const errors = [];
        const rootSpan = this.telemetry.start("enterprise-runtime-orchestration", {
            sessionId: request.sessionId,
            artifacts: request.artifacts.length,
        });
        await this.events.publish({
            type: "enterprise.orchestration.started",
            source: "CodeGenEnterpriseRuntimeOrchestrator",
            payload: {
                sessionId: request.sessionId,
                artifacts: request.artifacts.length,
            },
            metadata: request.metadata,
        });
        const progress = new codegen_execution_progress_tracker_1.CodeGenExecutionProgressTracker(request.artifacts.length);
        const tasks = this.taskFactory.fromArtifacts(request.artifacts);
        const queue = new codegen_priority_task_queue_1.CodeGenPriorityTaskQueue();
        const pool = new codegen_execution_worker_pool_1.CodeGenExecutionWorkerPool(Math.max(1, request.maximumWorkers));
        const executor = new codegen_default_worker_executor_1.CodeGenDefaultWorkerExecutor(this.handlers);
        const engine = new codegen_parallel_execution_engine_1.CodeGenParallelExecutionEngine(queue, pool, executor);
        const batch = await this.performance.measure("parallel-execution", async () => {
            if (!request.enableRetry) {
                return engine.execute(tasks);
            }
            const retryResult = await this.retry.execute(async () => {
                const result = await engine.execute(tasks.map((task) => ({
                    ...task,
                    status: codegen_execution_task_contracts_1.CodeGenExecutionTaskStatus.CREATED,
                    attempts: 0,
                    updatedAt: new Date().toISOString(),
                })));
                if (!result.success) {
                    throw new Error(`Parallel execution failed: ${result.failed} failed, ${result.skipped} skipped`);
                }
                return result;
            }, {
                maximumAttempts: 2,
                initialDelayMs: 25,
                maximumDelayMs: 100,
                multiplier: 2,
            });
            if (retryResult.success &&
                retryResult.value) {
                return retryResult.value;
            }
            throw new Error(retryResult.error ??
                "Parallel execution retry failed");
        });
        for (const result of batch.results) {
            if (result.success) {
                progress.incrementCompleted();
            }
            else if (result.skipped) {
                const snapshot = progress.snapshot();
                progress.update({
                    skipped: snapshot.skipped +
                        1,
                    pending: Math.max(0, snapshot.pending -
                        1),
                });
                if (result.error) {
                    warnings.push(result.error);
                }
            }
            else {
                progress.incrementFailed();
                if (result.error) {
                    errors.push(result.error);
                }
            }
        }
        const progressSnapshot = progress.snapshot();
        this.telemetry.complete(rootSpan.id, batch.success, {
            succeeded: batch.succeeded,
            failed: batch.failed,
            skipped: batch.skipped,
        });
        const telemetrySnapshot = this.telemetry.snapshot();
        const metrics = this.metrics.aggregate({
            batch,
            progress: progressSnapshot,
            telemetry: telemetrySnapshot,
            performance: this.performance.report(),
        });
        const completedAt = new Date().toISOString();
        await this.events.publish({
            type: "enterprise.orchestration.completed",
            source: "CodeGenEnterpriseRuntimeOrchestrator",
            payload: {
                sessionId: request.sessionId,
                success: batch.success,
                succeeded: batch.succeeded,
                failed: batch.failed,
                skipped: batch.skipped,
            },
            metadata: request.metadata,
        });
        return {
            success: batch.success &&
                errors.length === 0,
            sessionId: request.sessionId,
            batch,
            progress: progressSnapshot,
            telemetry: telemetrySnapshot,
            metrics,
            warnings,
            errors,
            startedAt,
            completedAt,
            durationMs: Date.parse(completedAt) -
                Date.parse(startedAt),
        };
    }
}
exports.CodeGenEnterpriseRuntimeOrchestrator = CodeGenEnterpriseRuntimeOrchestrator;
//# sourceMappingURL=codegen-enterprise-runtime-orchestrator.js.map