import { CodeGenExecutionPlan } from "../contracts/codegen-planning.contracts";
export interface CodeGenParallelGroup {
    stageIndex: number;
    groupIndex: number;
    artifactKeys: string[];
    totalWeight: number;
}
export declare class CodeGenParallelGroupPlanner {
    plan(executionPlan: CodeGenExecutionPlan, maxParallel: number): CodeGenParallelGroup[];
}
//# sourceMappingURL=codegen-parallel-group-planner.d.ts.map