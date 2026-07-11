"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenDependencyGraphAnalyzer = void 0;
const codegen_graph_cycle_detector_1 = require("../algorithms/codegen-graph-cycle-detector");
const codegen_graph_depth_analyzer_1 = require("./codegen-graph-depth-analyzer");
const codegen_critical_path_analyzer_1 = require("./codegen-critical-path-analyzer");
class CodeGenDependencyGraphAnalyzer {
    cycles;
    depth;
    criticalPath;
    constructor(cycles = new codegen_graph_cycle_detector_1.CodeGenGraphCycleDetector(), depth = new codegen_graph_depth_analyzer_1.CodeGenGraphDepthAnalyzer(), criticalPath = new codegen_critical_path_analyzer_1.CodeGenCriticalPathAnalyzer()) {
        this.cycles = cycles;
        this.depth = depth;
        this.criticalPath = criticalPath;
    }
    analyze(graph) {
        const snapshot = graph.snapshot();
        const cycles = this.cycles.detect(graph);
        const depth = this.depth.analyze(graph);
        const criticalPath = this.criticalPath.analyze(graph);
        const warnings = [];
        const errors = [];
        if (snapshot.isolated.length >
            0) {
            warnings.push(`Isolated artifacts: ${snapshot.isolated.join(", ")}`);
        }
        if (cycles.length > 0) {
            errors.push(...cycles.map((cycle) => `Circular dependency: ${cycle.path.join(" -> ")}`));
        }
        for (const node of snapshot.nodes) {
            if (node.state === "blocked") {
                errors.push(`Artifact is blocked by missing dependencies: ${node.key}`);
            }
        }
        return {
            valid: errors.length === 0,
            nodes: snapshot.nodes.length,
            edges: snapshot.edges.length,
            roots: snapshot.roots,
            leaves: snapshot.leaves,
            isolated: snapshot.isolated,
            cycles,
            maximumDepth: depth.maximumDepth,
            criticalPath,
            warnings,
            errors,
            generatedAt: new Date().toISOString(),
        };
    }
}
exports.CodeGenDependencyGraphAnalyzer = CodeGenDependencyGraphAnalyzer;
//# sourceMappingURL=codegen-dependency-graph-analyzer.js.map