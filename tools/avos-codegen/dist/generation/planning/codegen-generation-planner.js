"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenGenerationPlanner = void 0;
const codegen_artifact_graph_1 = require("../../artifacts/graph/codegen-artifact-graph");
const codegen_artifact_dependency_resolver_1 = require("../../artifacts/resolution/codegen-artifact-dependency-resolver");
const codegen_errors_1 = require("../../core/codegen.errors");
class CodeGenGenerationPlanner {
    resolver;
    constructor(resolver = new codegen_artifact_dependency_resolver_1.CodeGenArtifactDependencyResolver()) {
        this.resolver = resolver;
    }
    createPlan(artifacts) {
        const graph = new codegen_artifact_graph_1.CodeGenArtifactGraph();
        graph.addMany(artifacts);
        const plan = this.resolver.resolve(graph);
        if (!plan.valid) {
            const missing = plan.unresolvedDependencies
                .map((item) => `${item.artifactKey}->${item.dependencyKey}`)
                .join(", ");
            const cycles = plan.circularDependencies
                .map((cycle) => cycle.join(" -> "))
                .join("; ");
            throw new codegen_errors_1.CodeGenValidationError([
                "Artifact plan is invalid.",
                missing
                    ? `Missing: ${missing}.`
                    : "",
                cycles
                    ? `Cycles: ${cycles}.`
                    : "",
            ]
                .filter(Boolean)
                .join(" "));
        }
        return plan;
    }
}
exports.CodeGenGenerationPlanner = CodeGenGenerationPlanner;
//# sourceMappingURL=codegen-generation-planner.js.map