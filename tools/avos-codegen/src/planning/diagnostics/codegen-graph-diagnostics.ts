import {
  CodeGenPlanningDiagnostic,
} from "../contracts/codegen-planning.contracts";
import {
  CodeGenDependencyGraph,
} from "../graph/codegen-dependency-graph";
import {
  CodeGenDependencyGraphAnalyzer,
} from "../analysis/codegen-dependency-graph-analyzer";

export class CodeGenGraphDiagnostics {
  constructor(
    readonly analyzer =
      new CodeGenDependencyGraphAnalyzer(),
  ) {}

  diagnose(
    graph:
      CodeGenDependencyGraph,
  ): CodeGenPlanningDiagnostic[] {
    const analysis =
      this.analyzer.analyze(
        graph,
      );

    const diagnostics:
      CodeGenPlanningDiagnostic[] = [];

    diagnostics.push({
      code:
        "GRAPH_SUMMARY",
      message:
        `Graph contains ${analysis.nodes} nodes and ${analysis.edges} edges`,
      severity:
        "informational",
      details: {
        nodes:
          analysis.nodes,
        edges:
          analysis.edges,
        maximumDepth:
          analysis.maximumDepth,
      },
    });

    for (
      const warning of
      analysis.warnings
    ) {
      diagnostics.push({
        code:
          "GRAPH_WARNING",
        message:
          warning,
        severity:
          "warning",
      });
    }

    for (
      const error of
      analysis.errors
    ) {
      diagnostics.push({
        code:
          "GRAPH_ERROR",
        message:
          error,
        severity:
          "error",
      });
    }

    return diagnostics;
  }
}
