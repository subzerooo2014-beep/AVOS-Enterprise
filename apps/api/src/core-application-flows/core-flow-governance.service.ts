import { Injectable } from "@nestjs/common";
import { CoreFlowPolicyEngineService } from "./core-flow-policy-engine.service";
import { CoreFlowComplianceService } from "./core-flow-compliance.service";
import { CoreFlowEscalationService } from "./core-flow-escalation.service";
import { CoreFlowAuditService } from "./core-flow-audit.service";
import { CoreFlowApprovalService } from "./core-flow-approval.service";

@Injectable()
export class CoreFlowGovernanceService {
  constructor(
    private readonly policies: CoreFlowPolicyEngineService,
    private readonly compliance: CoreFlowComplianceService,
    private readonly escalations: CoreFlowEscalationService,
    private readonly audit: CoreFlowAuditService,
    private readonly approvals: CoreFlowApprovalService,
  ) {}

  evaluate(executionId: string, dto: any = {}) {
    const policy = String(dto?.policy ?? "default-core-flow-policy");
    const evaluation = this.policies.decide(
      executionId,
      policy,
      dto?.context ?? {},
    );

    const evidence = this.compliance.record(
      executionId,
      String(dto?.control ?? "AVOS-CF-001"),
      evaluation.decision.effect === "deny" ? "non-compliant" : "compliant",
      {
        policy,
        effect: evaluation.decision.effect,
        riskLevel: evaluation.assessment.level,
        riskScore: evaluation.assessment.score,
      },
    );

    let escalation = null;
    let approval = null;

    if (
      evaluation.decision.effect === "deny" ||
      evaluation.assessment.level === "critical"
    ) {
      escalation = this.escalations.open(
        executionId,
        evaluation.assessment.level,
        evaluation.decision.reason,
      );
    } else if (evaluation.decision.effect === "review") {
      approval = this.approvals.request(
        executionId,
        String(dto?.nodeId ?? "governance-review"),
      );
    }

    const audit = this.audit.write(
      executionId,
      "governance.evaluated",
      {
        policy,
        effect: evaluation.decision.effect,
        risk: evaluation.assessment.level,
      },
      String(dto?.actor ?? "system"),
    );

    return {
      executionId,
      ...evaluation,
      evidence,
      escalation,
      approval,
      audit,
    };
  }

  dashboard() {
    return {
      policies: this.policies.dashboard(),
      compliance: this.compliance.dashboard(),
      escalations: this.escalations.dashboard(),
      approvals: {
        pending: this.approvals.findAll({ status: "pending" }).length,
        approved: this.approvals.findAll({ status: "approved" }).length,
        rejected: this.approvals.findAll({ status: "rejected" }).length,
      },
      generatedAt: new Date().toISOString(),
    };
  }
}
