"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenGraphDiagnostics = void 0;
const codegen_dependency_graph_analyzer_1 = require("../analysis/codegen-dependency-graph-analyzer");
class CodeGenGraphDiagnostics {
    analyzer;
    constructor(analyzer = new codegen_dependency_graph_analyzer_1.CodeGenDependencyGraphAnalyzer()) {
        this.analyzer = analyzer;
    }
    diagnose(graph) {
        const analysis = this.analyzer.analyze(graph);
        const diagnostics = [];
        diagnostics.push({
            code: "GRAPH_SUMMARY",
            message: `Graph contains ${analysis.nodes} nodes and ${analysis.edges} edges`,
            severity: "informational",
            details: {
                nodes: analysis.nodes,
                edges: analysis.edges,
                maximumDepth: analysis.maximumDepth,
            },
        });
        for (const warning of analysis.warnings) {
            diagnostics.push({
                code: "GRAPH_WARNING",
                message: warning,
                severity: "warning",
            });
        }
        for (const error of analysis.errors) {
            diagnostics.push({
                code: "GRAPH_ERROR",
                message: error,
                severity: "error",
            });
        }
        return diagnostics;
    }
}
exports.CodeGenGraphDiagnostics = CodeGenGraphDiagnostics;
//# sourceMappingURL=codegen-graph-diagnostics.js.map