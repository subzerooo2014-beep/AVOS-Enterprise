"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenExecutionScheduler = void 0;
const codegen_concurrency_policy_engine_1 = require("../policies/codegen-concurrency-policy-engine");
const codegen_execution_schedule_builder_1 = require("./codegen-execution-schedule-builder");
class CodeGenExecutionScheduler {
    policies;
    builder;
    constructor(policies = new codegen_concurrency_policy_engine_1.CodeGenConcurrencyPolicyEngine(), builder = new codegen_execution_schedule_builder_1.CodeGenExecutionScheduleBuilder()) {
        this.policies = policies;
        this.builder = builder;
    }
    createSchedule(executionPlan, policyInput = {}) {
        const warnings = [];
        const errors = [];
        if (executionPlan.errors.length >
            0) {
            errors.push(...executionPlan.errors);
            return {
                success: false,
                warnings,
                errors,
                generatedAt: new Date().toISOString(),
            };
        }
        const policy = this.policies.normalize(policyInput);
        const schedule = this.builder.build(executionPlan, policy);
        if (schedule.estimatedParallelism ===
            1 &&
            executionPlan.nodes.length >
                1) {
            warnings.push("Execution is effectively serial");
        }
        return {
            success: true,
            schedule,
            warnings,
            errors,
            generatedAt: new Date().toISOString(),
        };
    }
}
exports.CodeGenExecutionScheduler = CodeGenExecutionScheduler;
//# sourceMappingURL=codegen-execution-scheduler.js.map