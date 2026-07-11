import { CodeGenPlanningContext, CodeGenPlanningResult } from "./codegen-planning.contracts";
export interface CodeGenPlannerDescriptor {
    key: string;
    name: string;
    description: string;
    version: string;
    priority: number;
    enabled: boolean;
    capabilities: string[];
}
export interface CodeGenPlanner {
    readonly descriptor: CodeGenPlannerDescriptor;
    plan(context: CodeGenPlanningContext): Promise<CodeGenPlanningResult> | CodeGenPlanningResult;
}
//# sourceMappingURL=codegen-planner.contracts.d.ts.map