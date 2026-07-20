import { Injectable } from "@nestjs/common";
import { AdaptiveGrowthGovernanceIdService } from "./adaptive-growth-governance-id.service";
import { AdaptiveGrowthApprovalStoreService } from "./adaptive-growth-approval-store.service";

@Injectable()
export class AdaptiveGrowthDecisionAuditService {
  constructor(
    private readonly ids:
      AdaptiveGrowthGovernanceIdService,
    private readonly store:
      AdaptiveGrowthApprovalStoreService,
  ) {}

  record(input: {
    decisionId?: string;
    approvalId: string;
    actionId: string;
    event: string;
    actor: string;
    details?: Record<string, unknown>;
  }) {
    return this.store.appendAudit({
      id: this.ids.create("ags-decision-audit"),
      decisionId: input.decisionId,
      approvalId: input.approvalId,
      actionId: input.actionId,
      event: input.event,
      actor: input.actor,
      details: input.details ?? {},
      createdAt: new Date().toISOString(),
    });
  }

  list(approvalId?: string) {
    return this.store.listAudit(approvalId);
  }

  status() {
    return {
      name: "AGS Decision Audit",
      status: "operational",
      immutableAppendModel: true,
      traceability: true,
      auditEntries:
        this.store.listAudit().length,
    };
  }
}