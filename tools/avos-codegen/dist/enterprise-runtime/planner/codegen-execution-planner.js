"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenExecutionPlanner = void 0;
const codegen_dependency_graph_1 = require("../graph/codegen-dependency-graph");
const codegen_parallel_scheduler_1 = require("../scheduler/codegen-parallel-scheduler");
class CodeGenExecutionPlanner {
    graph = new codegen_dependency_graph_1.CodeGenDependencyGraph();
    scheduler = new codegen_parallel_scheduler_1.CodeGenParallelScheduler();
    create(nodes) {
        this.graph.build(nodes);
        return {
            nodes: this.scheduler.schedule(nodes),
            createdAt: new Date().toISOString()
        };
    }
}
exports.CodeGenExecutionPlanner = CodeGenExecutionPlanner;
//# sourceMappingURL=codegen-execution-planner.js.map