import {
  CodeGenDependencyGraph,
} from "../graph/codegen-dependency-graph";
import {
  CodeGenGraphAnalysisResult,
} from "../graph/codegen-dependency-graph.contracts";
import {
  CodeGenGraphCycleDetector,
} from "../algorithms/codegen-graph-cycle-detector";
import {
  CodeGenGraphDepthAnalyzer,
} from "./codegen-graph-depth-analyzer";
import {
  CodeGenCriticalPathAnalyzer,
} from "./codegen-critical-path-analyzer";

export class CodeGenDependencyGraphAnalyzer {
  constructor(
    readonly cycles =
      new CodeGenGraphCycleDetector(),
    readonly depth =
      new CodeGenGraphDepthAnalyzer(),
    readonly criticalPath =
      new CodeGenCriticalPathAnalyzer(),
  ) {}

  analyze(
    graph:
      CodeGenDependencyGraph,
  ): CodeGenGraphAnalysisResult {
    const snapshot =
      graph.snapshot();

    const cycles =
      this.cycles.detect(
        graph,
      );

    const depth =
      this.depth.analyze(
        graph,
      );

    const criticalPath =
      this.criticalPath.analyze(
        graph,
      );

    const warnings: string[] = [];
    const errors: string[] = [];

    if (
      snapshot.isolated.length >
      0
    ) {
      warnings.push(
        `Isolated artifacts: ${snapshot.isolated.join(", ")}`,
      );
    }

    if (
      cycles.length > 0
    ) {
      errors.push(
        ...cycles.map(
          (cycle) =>
            `Circular dependency: ${cycle.path.join(" -> ")}`,
        ),
      );
    }

    for (
      const node of
      snapshot.nodes
    ) {
      if (
        node.state === "blocked"
      ) {
        errors.push(
          `Artifact is blocked by missing dependencies: ${node.key}`,
        );
      }
    }

    return {
      valid:
        errors.length === 0,
      nodes:
        snapshot.nodes.length,
      edges:
        snapshot.edges.length,
      roots:
        snapshot.roots,
      leaves:
        snapshot.leaves,
      isolated:
        snapshot.isolated,
      cycles,
      maximumDepth:
        depth.maximumDepth,
      criticalPath,
      warnings,
      errors,
      generatedAt:
        new Date().toISOString(),
    };
  }
}
