import {
  CodeGenExecutionPlan,
} from "../contracts/codegen-planning.contracts";
import {
  CodeGenConcurrencyPolicyEngine,
} from "../policies/codegen-concurrency-policy-engine";
import {
  CodeGenExecutionScheduleBuilder,
} from "./codegen-execution-schedule-builder";
import {
  CodeGenConcurrencyPolicy,
  CodeGenSchedulerResult,
} from "./codegen-scheduling.contracts";

export class CodeGenExecutionScheduler {
  constructor(
    readonly policies =
      new CodeGenConcurrencyPolicyEngine(),
    readonly builder =
      new CodeGenExecutionScheduleBuilder(),
  ) {}

  createSchedule(
    executionPlan:
      CodeGenExecutionPlan,
    policyInput:
      Partial<
        CodeGenConcurrencyPolicy
      > = {},
  ): CodeGenSchedulerResult {
    const warnings: string[] = [];
    const errors: string[] = [];

    if (
      executionPlan.errors.length >
      0
    ) {
      errors.push(
        ...executionPlan.errors,
      );

      return {
        success: false,
        warnings,
        errors,
        generatedAt:
          new Date().toISOString(),
      };
    }

    const policy =
      this.policies.normalize(
        policyInput,
      );

    const schedule =
      this.builder.build(
        executionPlan,
        policy,
      );

    if (
      schedule.estimatedParallelism ===
      1 &&
      executionPlan.nodes.length >
      1
    ) {
      warnings.push(
        "Execution is effectively serial",
      );
    }

    return {
      success: true,
      schedule,
      warnings,
      errors,
      generatedAt:
        new Date().toISOString(),
    };
  }
}
