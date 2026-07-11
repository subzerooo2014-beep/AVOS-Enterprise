import { CodeGenExecutionTaskFactory } from "../execution/runtime/codegen-execution-task-factory";
import { CodeGenExecutionTaskHandlerRegistry } from "../execution/runtime/codegen-execution-task-handler-registry";
import { CodeGenRuntimeEventBusV2 } from "../events-v2/codegen-runtime-event-bus-v2";
import { CodeGenRetryEngineV2 } from "../resilience/codegen-retry-engine-v2";
import { CodeGenRuntimeMetricsAggregator } from "../statistics/codegen-runtime-metrics-aggregator";
import { CodeGenRuntimePerformanceMonitor } from "../telemetry/codegen-runtime-performance-monitor";
import { CodeGenRuntimeTelemetryCollector } from "../telemetry/codegen-runtime-telemetry-collector";
import { CodeGenEnterpriseOrchestrationRequest, CodeGenEnterpriseOrchestrationResult } from "./codegen-enterprise-orchestrator.contracts";
export declare class CodeGenEnterpriseRuntimeOrchestrator {
    readonly handlers: CodeGenExecutionTaskHandlerRegistry;
    readonly taskFactory: CodeGenExecutionTaskFactory;
    readonly retry: CodeGenRetryEngineV2;
    readonly events: CodeGenRuntimeEventBusV2;
    readonly telemetry: CodeGenRuntimeTelemetryCollector;
    readonly performance: CodeGenRuntimePerformanceMonitor;
    readonly metrics: CodeGenRuntimeMetricsAggregator;
    execute(request: CodeGenEnterpriseOrchestrationRequest): Promise<CodeGenEnterpriseOrchestrationResult>;
}
//# sourceMappingURL=codegen-enterprise-runtime-orchestrator.d.ts.map