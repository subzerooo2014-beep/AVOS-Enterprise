import { Injectable } from "@nestjs/common";
import { AdaptiveGrowthActionService } from "../execution-core/adaptive-growth-action.service";
import { AdaptiveGrowthApprovalPolicyService } from "./adaptive-growth-approval-policy.service";
import { AdaptiveGrowthApprovalStoreService } from "./adaptive-growth-approval-store.service";
import { AdaptiveGrowthDecisionAuditService } from "./adaptive-growth-decision-audit.service";
import { AdaptiveGrowthGovernanceIdService } from "./adaptive-growth-governance-id.service";

@Injectable()
export class AdaptiveGrowthApprovalQueueService {
  constructor(
    private readonly actions:
      AdaptiveGrowthActionService,
    private readonly policies:
      AdaptiveGrowthApprovalPolicyService,
    private readonly store:
      AdaptiveGrowthApprovalStoreService,
    private readonly audit:
      AdaptiveGrowthDecisionAuditService,
    private readonly ids:
      AdaptiveGrowthGovernanceIdService,
  ) {}

  request(
    actionId: string,
    requestedBy = "human:khalifa",
  ) {
    const action = this.actions.get(actionId);

    if (
      action.state !== "pending-approval"
    ) {
      throw new Error(
        `Action ${actionId} is not pending approval.`,
      );
    }

    const existing =
      this.store.findByAction(actionId);

    if (existing) {
      return existing;
    }

    const policy = this.policies.resolve(
      action.riskLevel,
    );

    const now = new Date();
    const expiresAt = new Date(
      now.getTime() +
        policy.expiresAfterHours *
          60 *
          60 *
          1000,
    );

    const approval =
      this.store.saveApproval({
        id: this.ids.create(
          "ags-approval",
        ),
        actionId,
        policyKey: policy.key,
        status: "pending",
        priority:
          action.riskLevel === "critical"
            ? 100
            : action.riskLevel === "high"
              ? 80
              : action.riskLevel ===
                  "medium"
                ? 50
                : 20,
        requestedBy,
        riskLevel: action.riskLevel,
        requiredAuthority:
          policy.requiredAuthority,
        evidenceIds: [],
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
        expiresAt:
          expiresAt.toISOString(),
      });

    this.audit.record({
      approvalId: approval.id,
      actionId,
      event: "approval-requested",
      actor: requestedBy,
      details: {
        policyKey: policy.key,
        riskLevel: action.riskLevel,
        requiredAuthority:
          policy.requiredAuthority,
      },
    });

    return approval;
  }

  assign(
    approvalId: string,
    assignedTo: string,
    actor = "human:khalifa",
  ) {
    const approval =
      this.store.getApproval(approvalId);

    const updated =
      this.store.saveApproval({
        ...approval,
        assignedTo,
        status: "assigned",
        updatedAt:
          new Date().toISOString(),
      });

    this.audit.record({
      approvalId,
      actionId: approval.actionId,
      event: "approval-assigned",
      actor,
      details: {
        assignedTo,
      },
    });

    return updated;
  }

  list(status?: string) {
    const approvals =
      this.store.listApprovals();

    return status
      ? approvals.filter(
          (item) =>
            item.status === status,
        )
      : approvals;
  }

  get(id: string) {
    return this.store.getApproval(id);
  }

  status() {
    const approvals =
      this.store.listApprovals();

    return {
      name: "AGS Approval Queue",
      status: "operational",
      total: approvals.length,
      pending: approvals.filter(
        (item) =>
          item.status === "pending",
      ).length,
      underReview: approvals.filter(
        (item) =>
          item.status ===
          "under-review",
      ).length,
      approved: approvals.filter(
        (item) =>
          item.status === "approved",
      ).length,
      rejected: approvals.filter(
        (item) =>
          item.status === "rejected",
      ).length,
    };
  }
}