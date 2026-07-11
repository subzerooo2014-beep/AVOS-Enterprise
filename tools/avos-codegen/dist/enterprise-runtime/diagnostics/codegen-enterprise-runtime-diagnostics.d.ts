import { CodeGenArtifactGraphV2 } from "../graph-v2/codegen-artifact-graph-v2.contracts";
import { CodeGenWorkspaceScanResult } from "../workspace/codegen-workspace.contracts";
export interface CodeGenEnterpriseRuntimeDiagnostic {
    code: string;
    severity: "informational" | "warning" | "error" | "critical";
    message: string;
    details: Record<string, string | number | boolean>;
}
export declare class CodeGenEnterpriseRuntimeDiagnostics {
    analyze(input: {
        graph: CodeGenArtifactGraphV2;
        workspace?: CodeGenWorkspaceScanResult;
    }): CodeGenEnterpriseRuntimeDiagnostic[];
}
//# sourceMappingURL=codegen-enterprise-runtime-diagnostics.d.ts.map