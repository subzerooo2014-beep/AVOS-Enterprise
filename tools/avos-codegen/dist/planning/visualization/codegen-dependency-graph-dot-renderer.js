"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenDependencyGraphDotRenderer = void 0;
class CodeGenDependencyGraphDotRenderer {
    render(graph) {
        const lines = [
            "digraph AVOS_CODEGEN {",
            '  rankdir="LR";',
            '  node [shape="box"];',
        ];
        for (const node of graph.listNodes()) {
            lines.push(`  "${node.key}" [label="${node.key}\\nweight=${node.weight}"];`);
        }
        for (const edge of graph.listEdges()) {
            lines.push(`  "${edge.from}" -> "${edge.to}" [label="${edge.weight}"];`);
        }
        lines.push("}");
        return lines.join("\n");
    }
}
exports.CodeGenDependencyGraphDotRenderer = CodeGenDependencyGraphDotRenderer;
//# sourceMappingURL=codegen-dependency-graph-dot-renderer.js.map