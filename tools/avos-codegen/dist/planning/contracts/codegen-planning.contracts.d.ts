import { CodeGenJsonValue, CodeGenMetadata } from "../../core/codegen.contracts";
import { CodeGenArtifactDescriptor } from "../../artifacts/codegen-artifact.contracts";
export declare enum CodeGenPlanningStatus {
    CREATED = "created",
    VALIDATING = "validating",
    READY = "ready",
    PLANNING = "planning",
    COMPLETED = "completed",
    FAILED = "failed"
}
export declare enum CodeGenExecutionStageType {
    SERIAL = "serial",
    PARALLEL = "parallel",
    BARRIER = "barrier"
}
export declare enum CodeGenPlanningPolicy {
    STRICT = "strict",
    BEST_EFFORT = "best_effort",
    FAIL_FAST = "fail_fast"
}
export interface CodeGenPlanningContext {
    executionId: string;
    workspaceRoot: string;
    targetRoot: string;
    artifacts: CodeGenArtifactDescriptor[];
    variables: Record<string, CodeGenJsonValue>;
    metadata: CodeGenMetadata;
    policy: CodeGenPlanningPolicy;
    createdAt: string;
}
export interface CodeGenPlanningNode {
    key: string;
    artifact: CodeGenArtifactDescriptor;
    dependencies: string[];
    dependents: string[];
    depth: number;
    stage: number;
    ready: boolean;
    blockedBy: string[];
}
export interface CodeGenExecutionStage {
    index: number;
    type: CodeGenExecutionStageType;
    artifactKeys: string[];
    dependsOnStages: number[];
    canRunInParallel: boolean;
}
export interface CodeGenExecutionPlan {
    id: string;
    executionId: string;
    status: CodeGenPlanningStatus;
    nodes: CodeGenPlanningNode[];
    stages: CodeGenExecutionStage[];
    orderedArtifactKeys: string[];
    warnings: string[];
    errors: string[];
    metadata: CodeGenMetadata;
    createdAt: string;
    completedAt?: string;
}
export interface CodeGenPlanningDiagnostic {
    code: string;
    message: string;
    severity: "informational" | "warning" | "error" | "critical";
    artifactKey?: string;
    details?: Record<string, CodeGenJsonValue>;
}
export interface CodeGenPlanningResult {
    success: boolean;
    plan?: CodeGenExecutionPlan;
    diagnostics: CodeGenPlanningDiagnostic[];
    warnings: string[];
    errors: string[];
    generatedAt: string;
}
//# sourceMappingURL=codegen-planning.contracts.d.ts.map