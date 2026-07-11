import {
  CodeGenArtifactGraphV2,
} from "../graph-v2/codegen-artifact-graph-v2.contracts";
import {
  CodeGenWorkspaceScanResult,
} from "../workspace/codegen-workspace.contracts";

export interface CodeGenEnterpriseRuntimeDiagnostic {
  code: string;
  severity:
    | "informational"
    | "warning"
    | "error"
    | "critical";
  message: string;
  details:
    Record<
      string,
      string | number | boolean
    >;
}

export class CodeGenEnterpriseRuntimeDiagnostics {
  analyze(
    input: {
      graph:
        CodeGenArtifactGraphV2;
      workspace?:
        CodeGenWorkspaceScanResult;
    },
  ): CodeGenEnterpriseRuntimeDiagnostic[] {
    const diagnostics:
      CodeGenEnterpriseRuntimeDiagnostic[] =
      [];

    diagnostics.push({
      code:
        "GRAPH_SUMMARY",
      severity:
        "informational",
      message:
        "Artifact graph analyzed",
      details: {
        nodes:
          input.graph.nodes.length,
        roots:
          input.graph.roots.length,
        leaves:
          input.graph.leaves.length,
      },
    });

    if (
      input.graph.cycles.length >
      0
    ) {
      diagnostics.push({
        code:
          "GRAPH_CYCLES_DETECTED",
        severity:
          "critical",
        message:
          "Artifact graph contains circular dependencies",
        details: {
          cycles:
            input.graph.cycles.length,
        },
      });
    }

    const unresolved =
      Object.keys(
        input.graph.unresolvedDependencies,
      ).length;

    if (
      unresolved > 0
    ) {
      diagnostics.push({
        code:
          "UNRESOLVED_DEPENDENCIES",
        severity:
          "error",
        message:
          "Artifact graph contains unresolved dependencies",
        details: {
          artifacts:
            unresolved,
        },
      });
    }

    if (
      input.workspace &&
      input.workspace.errors.length >
      0
    ) {
      diagnostics.push({
        code:
          "WORKSPACE_SCAN_ERRORS",
        severity:
          "warning",
        message:
          "Workspace scan completed with errors",
        details: {
          errors:
            input.workspace.errors.length,
        },
      });
    }

    return diagnostics;
  }
}
