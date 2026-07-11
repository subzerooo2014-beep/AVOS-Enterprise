import { CodeGenArtifactDescriptor } from "../../artifacts/codegen-artifact.contracts";
import { CodeGenArtifactGraphBuilderV2 } from "../graph-v2/codegen-artifact-graph-builder-v2";
import { CodeGenEnterpriseRuntimeDiagnostics } from "../diagnostics/codegen-enterprise-runtime-diagnostics";
import { CodeGenEnterpriseRuntimeHealthMonitor } from "../health/codegen-enterprise-runtime-health-monitor";
import { CodeGenEnterpriseRuntimeLogger } from "../logging/codegen-enterprise-runtime-logger";
import { CodeGenWorkspaceScanner } from "../workspace/codegen-workspace-scanner";
import { CodeGenWorkspaceSynchronizer } from "../workspace/codegen-workspace-synchronizer";
export declare class CodeGenEnterpriseBuildCoordinatorV2 {
    readonly graph: CodeGenArtifactGraphBuilderV2;
    readonly diagnostics: CodeGenEnterpriseRuntimeDiagnostics;
    readonly health: CodeGenEnterpriseRuntimeHealthMonitor;
    readonly logger: CodeGenEnterpriseRuntimeLogger;
    readonly scanner: CodeGenWorkspaceScanner;
    readonly synchronizer: CodeGenWorkspaceSynchronizer;
    constructor(graph?: CodeGenArtifactGraphBuilderV2, diagnostics?: CodeGenEnterpriseRuntimeDiagnostics, health?: CodeGenEnterpriseRuntimeHealthMonitor, logger?: CodeGenEnterpriseRuntimeLogger, scanner?: CodeGenWorkspaceScanner, synchronizer?: CodeGenWorkspaceSynchronizer);
    execute(input: {
        workspaceRoot: string;
        targetRoot: string;
        artifacts: readonly CodeGenArtifactDescriptor[];
        dryRun: boolean;
        scanWorkspace?: boolean;
    }): Promise<{
        success: boolean;
        graph: import("..").CodeGenArtifactGraphV2;
        workspace: import("..").CodeGenWorkspaceScanResult | undefined;
        diagnostics: import("../diagnostics/codegen-enterprise-runtime-diagnostics").CodeGenEnterpriseRuntimeDiagnostic[];
        health: import("../health/codegen-enterprise-runtime-health-monitor").CodeGenEnterpriseRuntimeHealth;
        synchronization: undefined;
        logs: import("../logging/codegen-enterprise-runtime-logger").CodeGenRuntimeLogEntry[];
    } | {
        success: boolean;
        graph: import("..").CodeGenArtifactGraphV2;
        workspace: import("..").CodeGenWorkspaceScanResult | undefined;
        diagnostics: import("../diagnostics/codegen-enterprise-runtime-diagnostics").CodeGenEnterpriseRuntimeDiagnostic[];
        health: import("../health/codegen-enterprise-runtime-health-monitor").CodeGenEnterpriseRuntimeHealth;
        synchronization: import("../workspace/codegen-workspace-synchronizer").CodeGenWorkspaceSynchronizationResult;
        logs: import("../logging/codegen-enterprise-runtime-logger").CodeGenRuntimeLogEntry[];
    }>;
}
//# sourceMappingURL=codegen-enterprise-build-coordinator-v2.d.ts.map