import { Injectable } from "@nestjs/common";
import { AeosPlan } from "./aeos.contracts";
import { HumanApprovalGateService } from "./human-approval-gate.service";
import { PolicyAwareAutomationService } from "./policy-aware-automation.service";

@Injectable()
export class UrpAutonomousExecutionService {
  constructor(
    private readonly policy: PolicyAwareAutomationService,
    private readonly approvals: HumanApprovalGateService,
  ) {}

  async execute(plan: AeosPlan, approvedBy?: string) {
    if (plan.status !== "approved") {
      throw new Error("AEOS plan must be approved before execution.");
    }

    const executions = [];

    for (const step of plan.steps) {
      const policy = this.policy.evaluate({
        action: step.action,
        risk:
          step.risk === "critical"
            ? 100
            : step.risk === "high"
              ? 75
              : step.risk === "medium"
                ? 45
                : 15,
        cost: step.estimatedCost,
        reversible: step.risk !== "critical",
      });

      if (policy.requiresHumanApproval && !approvedBy?.startsWith("human:")) {
        const approval = this.approvals.request({
          action: step.action,
          reason: "AEOS policy requires Human Final Authority.",
          requestedBy: "aeos:autonomous-execution",
          payload: step,
        });

        executions.push({
          stepId: step.id,
          status: "awaiting-human-approval",
          approval,
        });
        continue;
      }

      const response = await fetch(
        (process.env.AVOS_INTERNAL_API_BASE_URL ?? "http://localhost:3000") +
          "/avos/runtime/production/dispatch/command/" +
          step.targetUnit,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            name: step.action,
            payload: {
              planId: plan.id,
              stepId: step.id,
            },
            requestedBy: approvedBy ?? "human:khalifa",
            timeoutMs: 5000,
            retries: 2,
          }),
        },
      );

      const text = await response.text();
      let body: unknown = text;
      try {
        body = text ? JSON.parse(text) : {};
      } catch {
        body = text;
      }

      executions.push({
        stepId: step.id,
        targetUnit: step.targetUnit,
        action: step.action,
        status: response.ok ? "dispatched" : "failed",
        statusCode: response.status,
        response: body,
      });
    }

    return {
      planId: plan.id,
      status: executions.some(
        (execution) => execution.status === "awaiting-human-approval",
      )
        ? "awaiting-human-approval"
        : executions.some((execution) => execution.status === "failed")
          ? "partially-failed"
          : "dispatched",
      executions,
      executedAt: new Date().toISOString(),
    };
  }
}