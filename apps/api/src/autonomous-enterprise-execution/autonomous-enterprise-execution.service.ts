import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { AUTONOMOUS_EXECUTION_CAPABILITIES } from "./autonomous-enterprise-execution.registry";
import {
  AutonomousExecutionPlan,
  AutonomousExecutionRun,
  ExecutionPolicyResult,
} from "./autonomous-enterprise-execution.types";

@Injectable()
export class AutonomousEnterpriseExecutionService {
  private readonly plans = new Map<string, AutonomousExecutionPlan>();
  private readonly runs = new Map<string, AutonomousExecutionRun>();

  framework() {
    return {
      system: "AVOS Autonomous Enterprise Execution Platform V1",
      status: "READY",
      capabilityCount: Object.keys(AUTONOMOUS_EXECUTION_CAPABILITIES).length,
      capabilities: structuredClone(AUTONOMOUS_EXECUTION_CAPABILITIES),
    };
  }

  createPlan(
    input: Omit<
      AutonomousExecutionPlan,
      "id" | "status" | "createdAt" | "updatedAt"
    >,
  ) {
    if (!input.name.trim() || !input.owner.trim()) {
      throw new Error("Execution plan name and owner are required");
    }

    if (input.steps.length === 0) {
      throw new Error("Execution plan must include at least one step");
    }

    if (input.riskScore < 0 || input.riskScore > 100) {
      throw new Error("Risk score must be between 0 and 100");
    }

    if (input.budgetLimit < 0) {
      throw new Error("Budget limit cannot be negative");
    }

    const sequences = input.steps.map((step) => step.sequence);
    const uniqueSequences = new Set(sequences);

    if (uniqueSequences.size !== sequences.length) {
      throw new Error("Execution step sequences must be unique");
    }

    const now = new Date().toISOString();

    const plan: AutonomousExecutionPlan = {
      ...input,
      id: randomUUID(),
      name: input.name.trim(),
      owner: input.owner.trim(),
      steps: input.steps
        .map((step) => ({ ...step }))
        .sort((a, b) => a.sequence - b.sequence),
      status: "DRAFT",
      createdAt: now,
      updatedAt: now,
    };

    this.plans.set(plan.id, plan);
    return this.clonePlan(plan);
  }

  evaluatePolicy(id: string): ExecutionPolicyResult {
    const plan = this.requirePlan(id);
    const violations: string[] = [];
    const requiredApprovals: string[] = [];

    if (plan.riskScore >= 80) {
      violations.push("Risk score exceeds autonomous execution threshold");
    }

    if (
      plan.autonomyLevel === "FULL_AUTONOMY" &&
      plan.riskScore >= 50
    ) {
      violations.push("Full autonomy is not allowed for medium or high risk plans");
    }

    if (plan.budgetLimit > 1000000) {
      requiredApprovals.push("EXECUTIVE_FINANCE_APPROVAL");
    }

    if (plan.steps.some((step) => step.requiresApproval)) {
      requiredApprovals.push("HUMAN_STEP_APPROVAL");
    }

    if (
      plan.autonomyLevel === "CONDITIONAL_AUTONOMY" ||
      plan.autonomyLevel === "FULL_AUTONOMY"
    ) {
      requiredApprovals.push("AUTONOMY_POLICY_APPROVAL");
    }

    return {
      allowed: violations.length === 0,
      violations,
      requiredApprovals: [...new Set(requiredApprovals)],
      evaluatedAt: new Date().toISOString(),
    };
  }

  validatePlan(id: string) {
    const plan = this.requirePlan(id);
    const policy = this.evaluatePolicy(id);

    if (!policy.allowed) {
      throw new Error(`Plan validation failed: ${policy.violations.join("; ")}`);
    }

    plan.status =
      policy.requiredApprovals.length > 0
        ? "APPROVAL_PENDING"
        : "VALIDATED";

    plan.updatedAt = new Date().toISOString();
    this.plans.set(id, plan);

    return {
      plan: this.clonePlan(plan),
      policy,
    };
  }

  approvePlan(id: string, approved: boolean) {
    const plan = this.requirePlan(id);

    if (plan.status !== "APPROVAL_PENDING") {
      throw new Error("Plan is not waiting for approval");
    }

    plan.status = approved ? "APPROVED" : "FAILED";
    plan.updatedAt = new Date().toISOString();
    this.plans.set(id, plan);

    return this.clonePlan(plan);
  }

  startRun(planId: string) {
    const plan = this.requirePlan(planId);

    if (!["VALIDATED", "APPROVED"].includes(plan.status)) {
      throw new Error("Plan must be validated or approved before execution");
    }

    const now = new Date().toISOString();

    plan.status = "RUNNING";
    plan.updatedAt = now;
    this.plans.set(planId, plan);

    const run: AutonomousExecutionRun = {
      id: randomUUID(),
      planId,
      status: "RUNNING",
      currentStep: plan.steps[0].sequence,
      completedSteps: [],
      spentAmount: 0,
      startedAt: now,
      evidence: [],
      createdAt: now,
      updatedAt: now,
    };

    this.runs.set(run.id, run);
    return this.cloneRun(run);
  }

  completeStep(
    runId: string,
    input: {
      stepSequence: number;
      spentAmount: number;
      evidence: string;
    },
  ) {
    const run = this.requireRun(runId);
    const plan = this.requirePlan(run.planId);

    if (run.status !== "RUNNING") {
      throw new Error("Execution run is not active");
    }

    const step = plan.steps.find(
      (item) => item.sequence === input.stepSequence,
    );

    if (!step) {
      throw new Error(`Unknown execution step: ${input.stepSequence}`);
    }

    if (input.spentAmount < 0) {
      throw new Error("Spent amount cannot be negative");
    }

    const nextSpentAmount = run.spentAmount + input.spentAmount;

    if (nextSpentAmount > plan.budgetLimit) {
      throw new Error("Execution budget limit exceeded");
    }

    if (!run.completedSteps.includes(input.stepSequence)) {
      run.completedSteps.push(input.stepSequence);
    }

    run.spentAmount = nextSpentAmount;
    run.evidence.push(input.evidence);

    const remainingSteps = plan.steps.filter(
      (item) => !run.completedSteps.includes(item.sequence),
    );

    if (remainingSteps.length === 0) {
      run.status = "COMPLETED";
      run.completedAt = new Date().toISOString();

      plan.status = "COMPLETED";
      plan.updatedAt = run.completedAt;
      this.plans.set(plan.id, plan);
    } else {
      run.currentStep = remainingSteps[0].sequence;
    }

    run.updatedAt = new Date().toISOString();
    this.runs.set(runId, run);

    return this.cloneRun(run);
  }

  failRun(
    runId: string,
    input: { failedStep: number; evidence: string },
  ) {
    const run = this.requireRun(runId);
    const plan = this.requirePlan(run.planId);

    run.status = "FAILED";
    run.failedStep = input.failedStep;
    run.evidence.push(input.evidence);
    run.updatedAt = new Date().toISOString();

    plan.status = "FAILED";
    plan.updatedAt = run.updatedAt;

    this.runs.set(runId, run);
    this.plans.set(plan.id, plan);

    return this.cloneRun(run);
  }

  rollbackRun(runId: string, evidence: string) {
    const run = this.requireRun(runId);
    const plan = this.requirePlan(run.planId);

    if (!["FAILED", "COMPLETED"].includes(run.status)) {
      throw new Error("Only failed or completed runs may be rolled back");
    }

    run.status = "ROLLED_BACK";
    run.evidence.push(evidence);
    run.updatedAt = new Date().toISOString();

    plan.status = "ROLLED_BACK";
    plan.updatedAt = run.updatedAt;

    this.runs.set(runId, run);
    this.plans.set(plan.id, plan);

    return this.cloneRun(run);
  }

  listPlans(tenantId?: string) {
    return Array.from(this.plans.values())
      .filter((item) => !tenantId || item.tenantId === tenantId)
      .map((item) => this.clonePlan(item));
  }

  commandCenter() {
    const plans = Array.from(this.plans.values());
    const runs = Array.from(this.runs.values());

    return {
      system: "AVOS Autonomous Enterprise Execution Platform V1",
      capabilities: Object.keys(AUTONOMOUS_EXECUTION_CAPABILITIES).length,
      plans: plans.length,
      runningPlans: plans.filter((item) => item.status === "RUNNING").length,
      completedPlans: plans.filter((item) => item.status === "COMPLETED").length,
      failedPlans: plans.filter((item) => item.status === "FAILED").length,
      rolledBackPlans: plans.filter(
        (item) => item.status === "ROLLED_BACK",
      ).length,
      runs: runs.length,
      activeRuns: runs.filter((item) => item.status === "RUNNING").length,
      completedRuns: runs.filter((item) => item.status === "COMPLETED").length,
      totalSpent: Number(
        runs.reduce((sum, item) => sum + item.spentAmount, 0).toFixed(2),
      ),
      generatedAt: new Date().toISOString(),
    };
  }

  private requirePlan(id: string) {
    const plan = this.plans.get(id);

    if (!plan) {
      throw new Error(`Execution plan not found: ${id}`);
    }

    return plan;
  }

  private requireRun(id: string) {
    const run = this.runs.get(id);

    if (!run) {
      throw new Error(`Execution run not found: ${id}`);
    }

    return run;
  }

  private clonePlan(
    plan: AutonomousExecutionPlan,
  ): AutonomousExecutionPlan {
    return {
      ...plan,
      steps: plan.steps.map((step) => ({ ...step })),
    };
  }

  private cloneRun(
    run: AutonomousExecutionRun,
  ): AutonomousExecutionRun {
    return {
      ...run,
      completedSteps: [...run.completedSteps],
      evidence: [...run.evidence],
    };
  }
}