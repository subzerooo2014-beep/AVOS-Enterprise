import {
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import {
  AgsApprovalRequest,
  AgsDecisionAuditEntry,
  AgsDecisionEvidence,
  AgsDecisionRecord,
} from "./adaptive-growth-approval.contracts";

@Injectable()
export class AdaptiveGrowthApprovalStoreService {
  private readonly approvals =
    new Map<string, AgsApprovalRequest>();

  private readonly evidence =
    new Map<string, AgsDecisionEvidence>();

  private readonly decisions =
    new Map<string, AgsDecisionRecord>();

  private readonly audit:
    AgsDecisionAuditEntry[] = [];

  saveApproval(
    approval: AgsApprovalRequest,
  ): AgsApprovalRequest {
    this.approvals.set(approval.id, {
      ...approval,
    });

    return approval;
  }

  getApproval(id: string): AgsApprovalRequest {
    const approval = this.approvals.get(id);

    if (!approval) {
      throw new NotFoundException(
        `Approval request not found: ${id}`,
      );
    }

    return approval;
  }

  findByAction(
    actionId: string,
  ): AgsApprovalRequest | undefined {
    return this.listApprovals().find(
      (item) => item.actionId === actionId,
    );
  }

  listApprovals(): AgsApprovalRequest[] {
    return [...this.approvals.values()].sort(
      (a, b) =>
        b.createdAt.localeCompare(a.createdAt),
    );
  }

  saveEvidence(
    item: AgsDecisionEvidence,
  ): AgsDecisionEvidence {
    this.evidence.set(item.id, {
      ...item,
    });

    return item;
  }

  getEvidence(id: string): AgsDecisionEvidence {
    const item = this.evidence.get(id);

    if (!item) {
      throw new NotFoundException(
        `Decision evidence not found: ${id}`,
      );
    }

    return item;
  }

  listEvidence(
    approvalId?: string,
  ): AgsDecisionEvidence[] {
    const items = [...this.evidence.values()];

    return items
      .filter(
        (item) =>
          !approvalId ||
          item.approvalId === approvalId,
      )
      .sort(
        (a, b) =>
          b.collectedAt.localeCompare(
            a.collectedAt,
          ),
      );
  }

  saveDecision(
    decision: AgsDecisionRecord,
  ): AgsDecisionRecord {
    this.decisions.set(decision.id, {
      ...decision,
    });

    return decision;
  }

  getDecision(id: string): AgsDecisionRecord {
    const decision = this.decisions.get(id);

    if (!decision) {
      throw new NotFoundException(
        `Decision not found: ${id}`,
      );
    }

    return decision;
  }

  listDecisions(): AgsDecisionRecord[] {
    return [...this.decisions.values()].sort(
      (a, b) =>
        b.createdAt.localeCompare(a.createdAt),
    );
  }

  appendAudit(
    entry: AgsDecisionAuditEntry,
  ): AgsDecisionAuditEntry {
    this.audit.unshift(entry);
    return entry;
  }

  listAudit(
    approvalId?: string,
  ): AgsDecisionAuditEntry[] {
    if (!approvalId) {
      return [...this.audit];
    }

    return this.audit.filter(
      (item) =>
        item.approvalId === approvalId,
    );
  }

  status() {
    return {
      approvals: this.approvals.size,
      evidence: this.evidence.size,
      decisions: this.decisions.size,
      auditEntries: this.audit.length,
      persistenceMode: "in-memory",
      durablePersistencePlanned: true,
    };
  }
}