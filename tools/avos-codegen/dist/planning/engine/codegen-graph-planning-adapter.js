"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenGraphPlanningAdapter = void 0;
const codegen_dependency_graph_1 = require("../graph/codegen-dependency-graph");
const codegen_dependency_graph_analyzer_1 = require("../analysis/codegen-dependency-graph-analyzer");
const codegen_execution_plan_builder_1 = require("../builders/codegen-execution-plan-builder");
class CodeGenGraphPlanningAdapter {
    analyzer;
    builder;
    constructor(analyzer = new codegen_dependency_graph_analyzer_1.CodeGenDependencyGraphAnalyzer(), builder = new codegen_execution_plan_builder_1.CodeGenExecutionPlanBuilder()) {
        this.analyzer = analyzer;
        this.builder = builder;
    }
    execute(context) {
        const graph = new codegen_dependency_graph_1.CodeGenDependencyGraph();
        graph.addArtifacts(context.artifacts);
        const analysis = this.analyzer.analyze(graph);
        if (!analysis.valid) {
            return {
                success: false,
                diagnostics: [],
                warnings: analysis.warnings,
                errors: analysis.errors,
                generatedAt: new Date().toISOString(),
            };
        }
        const plan = this.builder.build(context);
        plan.metadata = {
            ...plan.metadata,
            graphNodes: analysis.nodes,
            graphEdges: analysis.edges,
            maximumDepth: analysis.maximumDepth,
            criticalPathWeight: analysis
                .criticalPath
                .totalWeight,
        };
        return {
            success: true,
            plan,
            diagnostics: [],
            warnings: analysis.warnings,
            errors: [],
            generatedAt: new Date().toISOString(),
        };
    }
}
exports.CodeGenGraphPlanningAdapter = CodeGenGraphPlanningAdapter;
//# sourceMappingURL=codegen-graph-planning-adapter.js.map