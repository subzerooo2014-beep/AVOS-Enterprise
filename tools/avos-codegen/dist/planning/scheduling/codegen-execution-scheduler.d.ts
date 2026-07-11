import { CodeGenExecutionPlan } from "../contracts/codegen-planning.contracts";
import { CodeGenConcurrencyPolicyEngine } from "../policies/codegen-concurrency-policy-engine";
import { CodeGenExecutionScheduleBuilder } from "./codegen-execution-schedule-builder";
import { CodeGenConcurrencyPolicy, CodeGenSchedulerResult } from "./codegen-scheduling.contracts";
export declare class CodeGenExecutionScheduler {
    readonly policies: CodeGenConcurrencyPolicyEngine;
    readonly builder: CodeGenExecutionScheduleBuilder;
    constructor(policies?: CodeGenConcurrencyPolicyEngine, builder?: CodeGenExecutionScheduleBuilder);
    createSchedule(executionPlan: CodeGenExecutionPlan, policyInput?: Partial<CodeGenConcurrencyPolicy>): CodeGenSchedulerResult;
}
//# sourceMappingURL=codegen-execution-scheduler.d.ts.map