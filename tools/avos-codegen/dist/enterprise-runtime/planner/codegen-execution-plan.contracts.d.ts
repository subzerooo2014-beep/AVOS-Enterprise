export interface CodeGenExecutionNode {
    id: string;
    key: string;
    dependencies: string[];
    priority: number;
}
export interface CodeGenExecutionPlan {
    nodes: CodeGenExecutionNode[];
    createdAt: string;
}
//# sourceMappingURL=codegen-execution-plan.contracts.d.ts.map