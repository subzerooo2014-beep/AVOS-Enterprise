import { CodeGenArtifactDescriptor } from "../../artifacts/codegen-artifact.contracts";
import { CodeGenMetadata } from "../../core/codegen.contracts";
import { CodeGenEnterpriseOrchestrationResult } from "../orchestration/codegen-enterprise-orchestrator.contracts";
import { CodeGenProductionReadinessReport } from "../readiness/codegen-production-readiness.contracts";
export interface CodeGenEnterpriseEndToEndRequest {
    sessionId: string;
    workspaceRoot: string;
    targetRoot: string;
    artifacts: CodeGenArtifactDescriptor[];
    maximumWorkers: number;
    enableRetry: boolean;
    dryRun: boolean;
    validateReadiness: boolean;
    metadata: CodeGenMetadata;
}
export interface CodeGenEnterpriseEndToEndResult {
    success: boolean;
    orchestration: CodeGenEnterpriseOrchestrationResult;
    readiness: CodeGenProductionReadinessReport;
    warnings: string[];
    errors: string[];
    startedAt: string;
    completedAt: string;
    durationMs: number;
}
//# sourceMappingURL=codegen-enterprise-e2e.contracts.d.ts.map