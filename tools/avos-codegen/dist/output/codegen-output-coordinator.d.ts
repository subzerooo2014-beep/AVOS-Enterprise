import { CodeGenArtifactDescriptor } from "../artifacts/codegen-artifact.contracts";
import { CodeGenAtomicFileWriter } from "./atomic/codegen-atomic-file-writer";
import { CodeGenOutputConflictDetector } from "./conflicts/codegen-output-conflict-detector";
import { CodeGenOutputIntegrityVerifier } from "./integrity/codegen-output-integrity-verifier";
import { CodeGenWorkspaceLockManager } from "./locking/codegen-workspace-lock-manager";
import { CodeGenOutputManifestEngine } from "./manifests/codegen-output-manifest-engine";
import { CodeGenGenerationReportEngine } from "./reports/codegen-generation-report-engine";
import { CodeGenConflictPolicy, CodeGenGenerationReport } from "./codegen-output.contracts";
export declare class CodeGenOutputCoordinator {
    readonly writer: CodeGenAtomicFileWriter;
    readonly conflicts: CodeGenOutputConflictDetector;
    readonly locks: CodeGenWorkspaceLockManager;
    readonly manifests: CodeGenOutputManifestEngine;
    readonly integrity: CodeGenOutputIntegrityVerifier;
    readonly reports: CodeGenGenerationReportEngine;
    constructor(writer?: CodeGenAtomicFileWriter, conflicts?: CodeGenOutputConflictDetector, locks?: CodeGenWorkspaceLockManager, manifests?: CodeGenOutputManifestEngine, integrity?: CodeGenOutputIntegrityVerifier, reports?: CodeGenGenerationReportEngine);
    execute(input: {
        sessionId: string;
        workspaceRoot: string;
        targetRoot: string;
        artifacts: readonly CodeGenArtifactDescriptor[];
        dryRun: boolean;
        conflictPolicy: CodeGenConflictPolicy;
    }): Promise<{
        manifest: ReturnType<CodeGenOutputManifestEngine["create"]>;
        report: CodeGenGenerationReport;
    }>;
}
//# sourceMappingURL=codegen-output-coordinator.d.ts.map