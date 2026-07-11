import { CodeGenExecutionPlan } from "../contracts/codegen-planning.contracts";
import { CodeGenArtifactPriorityCalculator } from "./codegen-artifact-priority-calculator";
import { CodeGenConcurrencyPolicy, CodeGenExecutionSchedule } from "./codegen-scheduling.contracts";
import { CodeGenRetryPolicyEngine } from "../retry/codegen-retry-policy-engine";
import { CodeGenStageBarrierPlanner } from "../barriers/codegen-stage-barrier-planner";
export declare class CodeGenExecutionScheduleBuilder {
    readonly priorities: CodeGenArtifactPriorityCalculator;
    readonly retries: CodeGenRetryPolicyEngine;
    readonly barriers: CodeGenStageBarrierPlanner;
    constructor(priorities?: CodeGenArtifactPriorityCalculator, retries?: CodeGenRetryPolicyEngine, barriers?: CodeGenStageBarrierPlanner);
    build(executionPlan: CodeGenExecutionPlan, policy: CodeGenConcurrencyPolicy): CodeGenExecutionSchedule;
}
//# sourceMappingURL=codegen-execution-schedule-builder.d.ts.map