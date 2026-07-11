import { CodeGenPlanner, CodeGenPlannerDescriptor } from "../contracts/codegen-planner.contracts";
import { CodeGenPlanningContext, CodeGenPlanningResult } from "../contracts/codegen-planning.contracts";
import { CodeGenExecutionPlanBuilder } from "../builders/codegen-execution-plan-builder";
import { CodeGenPlanningValidator } from "../validation/codegen-planning-validator";
export declare class CodeGenDefaultPlanner implements CodeGenPlanner {
    readonly validator: CodeGenPlanningValidator;
    readonly builder: CodeGenExecutionPlanBuilder;
    readonly descriptor: CodeGenPlannerDescriptor;
    constructor(validator?: CodeGenPlanningValidator, builder?: CodeGenExecutionPlanBuilder);
    plan(context: CodeGenPlanningContext): CodeGenPlanningResult;
}
//# sourceMappingURL=codegen-default-planner.d.ts.map