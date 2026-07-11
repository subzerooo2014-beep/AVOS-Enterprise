import { CodeGenExecutionNode } from "../planner/codegen-execution-plan.contracts";
export declare class CodeGenDependencyGraph {
    build(nodes: CodeGenExecutionNode[]): Map<string, CodeGenExecutionNode>;
    topological(nodes: CodeGenExecutionNode[]): CodeGenExecutionNode[];
}
//# sourceMappingURL=codegen-dependency-graph.d.ts.map