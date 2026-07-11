import {
  CodeGenDependencyGraph,
} from "../graph/codegen-dependency-graph";

export class CodeGenDependencyGraphDotRenderer {
  render(
    graph:
      CodeGenDependencyGraph,
  ): string {
    const lines = [
      "digraph AVOS_CODEGEN {",
      '  rankdir="LR";',
      '  node [shape="box"];',
    ];

    for (
      const node of
      graph.listNodes()
    ) {
      lines.push(
        `  "${node.key}" [label="${node.key}\\nweight=${node.weight}"];`,
      );
    }

    for (
      const edge of
      graph.listEdges()
    ) {
      lines.push(
        `  "${edge.from}" -> "${edge.to}" [label="${edge.weight}"];`,
      );
    }

    lines.push("}");

    return lines.join("\n");
  }
}
