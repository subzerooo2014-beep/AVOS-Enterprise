import { CodeGenArtifactDescriptor } from "../../artifacts/codegen-artifact.contracts";
import { CodeGenMetadata } from "../../core/codegen.contracts";
import { CodeGenExecutionBatchResult } from "../execution/contracts/codegen-execution-task.contracts";
import { CodeGenExecutionProgress } from "../progress/codegen-progress.contracts";
import { CodeGenRuntimeMetricsReport } from "../statistics/codegen-runtime-metrics-aggregator";
import { CodeGenTelemetrySnapshot } from "../telemetry/codegen-telemetry.contracts";
export interface CodeGenEnterpriseOrchestrationRequest {
    sessionId: string;
    workspaceRoot: string;
    targetRoot: string;
    artifacts: CodeGenArtifactDescriptor[];
    maximumWorkers: number;
    enableRetry: boolean;
    dryRun: boolean;
    metadata: CodeGenMetadata;
}
export interface CodeGenEnterpriseOrchestrationResult {
    success: boolean;
    sessionId: string;
    batch: CodeGenExecutionBatchResult;
    progress: CodeGenExecutionProgress;
    telemetry: CodeGenTelemetrySnapshot;
    metrics: CodeGenRuntimeMetricsReport;
    warnings: string[];
    errors: string[];
    startedAt: string;
    completedAt: string;
    durationMs: number;
}
//# sourceMappingURL=codegen-enterprise-orchestrator.contracts.d.ts.map