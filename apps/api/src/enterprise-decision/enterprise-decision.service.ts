import { Injectable } from "@nestjs/common";

import { DecisionPipeline } from "./engines/decision-pipeline";
import { PolicyEngine } from "./engines/policy-engine";
import { ApprovalEngine } from "./engines/approval-engine";
import { DecisionAudit } from "./engines/decision-audit";

@Injectable()
export class EnterpriseDecisionService {
  constructor(
    private readonly pipeline: DecisionPipeline,
    private readonly policy: PolicyEngine,
    private readonly approval: ApprovalEngine,
    private readonly audit: DecisionAudit,
  ) {}

  process(input: Record<string, any>) {
    const policy = this.policy.evaluate(input);

    if (!policy.allowed) {
      return {
        success: false,
        reason: "POLICY_DENIED",
      };
    }

    const decision = this.pipeline.process(input);
    const approval = this.approval.approve(decision);
    const audit = this.audit.log(approval);

    return {
      success: true,
      decision,
      approval,
      audit,
    };
  }

  status() {
    return {
      system: "AVOS Enterprise Decision",
      version: "E1.3",
      status: "running",
    };
  }
}
