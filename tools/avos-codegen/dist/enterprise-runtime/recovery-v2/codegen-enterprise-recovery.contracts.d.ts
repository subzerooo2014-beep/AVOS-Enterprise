import { CodeGenMetadata } from "../../core/codegen.contracts";
import { CodeGenEnterpriseGenerationSession } from "../contracts/codegen-enterprise-runtime.contracts";
export declare enum CodeGenEnterpriseRecoveryStatus {
    CREATED = "created",
    ANALYZING = "analyzing",
    RESTORING = "restoring",
    VALIDATING = "validating",
    COMPLETED = "completed",
    FAILED = "failed"
}
export interface CodeGenEnterpriseRecoveryRequest {
    session: CodeGenEnterpriseGenerationSession;
    snapshotId?: string;
    restoreArtifacts: boolean;
    restoreCache: boolean;
    validateAfterRestore: boolean;
    metadata: CodeGenMetadata;
}
export interface CodeGenEnterpriseRecoveryResult {
    success: boolean;
    status: CodeGenEnterpriseRecoveryStatus;
    restoredArtifacts: number;
    restoredCacheEntries: number;
    warnings: string[];
    errors: string[];
    startedAt: string;
    completedAt: string;
    durationMs: number;
}
//# sourceMappingURL=codegen-enterprise-recovery.contracts.d.ts.map