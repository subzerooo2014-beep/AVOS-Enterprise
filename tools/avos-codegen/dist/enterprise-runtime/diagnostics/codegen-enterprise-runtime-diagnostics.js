"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenEnterpriseRuntimeDiagnostics = void 0;
class CodeGenEnterpriseRuntimeDiagnostics {
    analyze(input) {
        const diagnostics = [];
        diagnostics.push({
            code: "GRAPH_SUMMARY",
            severity: "informational",
            message: "Artifact graph analyzed",
            details: {
                nodes: input.graph.nodes.length,
                roots: input.graph.roots.length,
                leaves: input.graph.leaves.length,
            },
        });
        if (input.graph.cycles.length >
            0) {
            diagnostics.push({
                code: "GRAPH_CYCLES_DETECTED",
                severity: "critical",
                message: "Artifact graph contains circular dependencies",
                details: {
                    cycles: input.graph.cycles.length,
                },
            });
        }
        const unresolved = Object.keys(input.graph.unresolvedDependencies).length;
        if (unresolved > 0) {
            diagnostics.push({
                code: "UNRESOLVED_DEPENDENCIES",
                severity: "error",
                message: "Artifact graph contains unresolved dependencies",
                details: {
                    artifacts: unresolved,
                },
            });
        }
        if (input.workspace &&
            input.workspace.errors.length >
                0) {
            diagnostics.push({
                code: "WORKSPACE_SCAN_ERRORS",
                severity: "warning",
                message: "Workspace scan completed with errors",
                details: {
                    errors: input.workspace.errors.length,
                },
            });
        }
        return diagnostics;
    }
}
exports.CodeGenEnterpriseRuntimeDiagnostics = CodeGenEnterpriseRuntimeDiagnostics;
//# sourceMappingURL=codegen-enterprise-runtime-diagnostics.js.map