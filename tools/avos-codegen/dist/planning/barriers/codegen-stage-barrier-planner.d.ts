import { CodeGenExecutionPlan } from "../contracts/codegen-planning.contracts";
import { CodeGenExecutionScheduleStage } from "../scheduling/codegen-scheduling.contracts";
export declare class CodeGenStageBarrierPlanner {
    plan(executionPlan: CodeGenExecutionPlan, maxParallel: number): CodeGenExecutionScheduleStage[];
}
//# sourceMappingURL=codegen-stage-barrier-planner.d.ts.map