import { CodeGenJsonValue, CodeGenMetadata } from "../core/codegen.contracts";
import { CodeGenArtifactDescriptor, CodeGenArtifactExecutionRecord, CodeGenResolvedArtifactPlan } from "../artifacts/codegen-artifact.contracts";
export declare enum CodeGenGenerationSessionStatus {
    CREATED = "created",
    PLANNING = "planning",
    READY = "ready",
    RUNNING = "running",
    COMMITTING = "committing",
    COMMITTED = "committed",
    ROLLING_BACK = "rolling_back",
    ROLLED_BACK = "rolled_back",
    FAILED = "failed"
}
export declare enum CodeGenTransactionOperationType {
    CREATE_FILE = "create_file",
    UPDATE_FILE = "update_file",
    SKIP_FILE = "skip_file",
    DELETE_FILE = "delete_file",
    RESTORE_FILE = "restore_file"
}
export interface CodeGenGenerationSessionInput {
    workspaceRoot: string;
    targetRoot: string;
    dryRun: boolean;
    variables: Record<string, CodeGenJsonValue>;
    metadata?: CodeGenMetadata;
}
export interface CodeGenGenerationSession {
    id: string;
    status: CodeGenGenerationSessionStatus;
    workspaceRoot: string;
    targetRoot: string;
    dryRun: boolean;
    variables: Record<string, CodeGenJsonValue>;
    metadata: CodeGenMetadata;
    artifacts: CodeGenArtifactDescriptor[];
    plan?: CodeGenResolvedArtifactPlan;
    records: CodeGenArtifactExecutionRecord[];
    error?: string;
    createdAt: string;
    updatedAt: string;
    startedAt?: string;
    completedAt?: string;
}
export interface CodeGenTransactionOperation {
    id: string;
    type: CodeGenTransactionOperationType;
    artifactKey: string;
    absolutePath: string;
    beforeExists: boolean;
    beforeContent?: string;
    afterContent?: string;
    checksumBefore?: string;
    checksumAfter?: string;
    executed: boolean;
    rolledBack: boolean;
    createdAt: string;
    executedAt?: string;
    rolledBackAt?: string;
}
export interface CodeGenGenerationTransactionSnapshot {
    id: string;
    sessionId: string;
    operations: number;
    executed: number;
    rolledBack: number;
    committed: boolean;
    createdAt: string;
    committedAt?: string;
    generatedAt: string;
}
//# sourceMappingURL=codegen-generation.contracts.d.ts.map