import {
  CodeGenPlanningContext,
  CodeGenPlanningResult,
} from "../contracts/codegen-planning.contracts";
import {
  CodeGenDependencyGraph,
} from "../graph/codegen-dependency-graph";
import {
  CodeGenDependencyGraphAnalyzer,
} from "../analysis/codegen-dependency-graph-analyzer";
import {
  CodeGenExecutionPlanBuilder,
} from "../builders/codegen-execution-plan-builder";

export class CodeGenGraphPlanningAdapter {
  constructor(
    readonly analyzer =
      new CodeGenDependencyGraphAnalyzer(),
    readonly builder =
      new CodeGenExecutionPlanBuilder(),
  ) {}

  execute(
    context:
      CodeGenPlanningContext,
  ): CodeGenPlanningResult {
    const graph =
      new CodeGenDependencyGraph();

    graph.addArtifacts(
      context.artifacts,
    );

    const analysis =
      this.analyzer.analyze(
        graph,
      );

    if (!analysis.valid) {
      return {
        success: false,
        diagnostics: [],
        warnings:
          analysis.warnings,
        errors:
          analysis.errors,
        generatedAt:
          new Date().toISOString(),
      };
    }

    const plan =
      this.builder.build(
        context,
      );

    plan.metadata = {
      ...plan.metadata,
      graphNodes:
        analysis.nodes,
      graphEdges:
        analysis.edges,
      maximumDepth:
        analysis.maximumDepth,
      criticalPathWeight:
        analysis
          .criticalPath
          .totalWeight,
    };

    return {
      success: true,
      plan,
      diagnostics: [],
      warnings:
        analysis.warnings,
      errors: [],
      generatedAt:
        new Date().toISOString(),
    };
  }
}
