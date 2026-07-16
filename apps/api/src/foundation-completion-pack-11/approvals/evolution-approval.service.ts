import {
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { EvolutionApprovalRequest } from "../foundation-pack-11.types";
import { ArchitectureEvolutionRequestService } from "../requests/architecture-evolution-request.service";
import { ArchitectureEvolutionPlanService } from "../plans/architecture-evolution-plan.service";
import { EvolutionAuditService } from "../observability/evolution-audit.service";
import { EvolutionHistoryService } from "../history/evolution-history.service";

@Injectable()
export class EvolutionApprovalService {
  private readonly approvals =
    new Map<string, EvolutionApprovalRequest>();

  constructor(
    private readonly requests: ArchitectureEvolutionRequestService,
    private readonly plans: ArchitectureEvolutionPlanService,
    private readonly audit: EvolutionAuditService,
    private readonly history: EvolutionHistoryService
  ) {}

  list() {
    return Array.from(this.approvals.values());
  }

  get(id: string) {
    const approval = this.approvals.get(id);

    if (!approval) {
      throw new NotFoundException(
        `Evolution approval not found: ${id}`
      );
    }

    return approval;
  }

  request(input: {
    requestId: string;
    planId: string;
    requestedByIdentityId: string;
    requiredRole: string;
    reason: string;
  }) {
    const request = this.requests.get(input.requestId);
    const plan = this.plans.get(input.planId);

    if (plan.requestId !== request.id) {
      throw new Error(
        "Plan does not belong to the evolution request."
      );
    }

    const approval: EvolutionApprovalRequest = {
      id: `evolution-approval:${Date.now()}:${
        this.approvals.size + 1
      }`,
      requestId: request.id,
      planId: plan.id,
      requestedByIdentityId: input.requestedByIdentityId,
      requiredRole: input.requiredRole,
      reason: input.reason,
      status: "pending",
      requestedAt: new Date().toISOString()
    };

    this.approvals.set(approval.id, approval);
    this.plans.updateStatus(
      plan.id,
      "waiting-approval",
      input.requestedByIdentityId
    );

    this.audit.record({
      correlationId: request.correlationId,
      category: "approval",
      action: "evolution-approval-requested",
      subjectId: approval.id,
      actorIdentityId: input.requestedByIdentityId,
      outcome: "pending",
      metadata: {
        planId: plan.id,
        requiredRole: input.requiredRole
      }
    });

    this.history.record({
      requestId: request.id,
      planId: plan.id,
      blueprintId: request.blueprintId,
      action: "approval-requested",
      actorIdentityId: input.requestedByIdentityId,
      metadata: {
        approvalId: approval.id
      }
    });

    return approval;
  }

  decide(
    id: string,
    input: {
      approved: boolean;
      approverIdentityId: string;
      decisionNote: string;
    }
  ) {
    const current = this.get(id);
    const request = this.requests.get(current.requestId);
    const plan = this.plans.get(current.planId);

    if (current.status !== "pending") {
      throw new Error(
        `Approval is not pending: ${id}`
      );
    }

    const updated: EvolutionApprovalRequest = {
      ...current,
      status: input.approved ? "approved" : "rejected",
      approverIdentityId: input.approverIdentityId,
      decisionNote: input.decisionNote,
      decidedAt: new Date().toISOString()
    };

    this.approvals.set(id, updated);

    if (input.approved) {
      this.plans.updateStatus(
        plan.id,
        "approved",
        input.approverIdentityId
      );

      this.requests.updateStatus(
        request.id,
        "approved",
        input.approverIdentityId
      );
    }
    else {
      this.plans.updateStatus(
        plan.id,
        "cancelled",
        input.approverIdentityId
      );

      this.requests.updateStatus(
        request.id,
        "rejected",
        input.approverIdentityId
      );
    }

    this.audit.record({
      correlationId: request.correlationId,
      category: "approval",
      action: input.approved
        ? "evolution-approved"
        : "evolution-rejected",
      subjectId: id,
      actorIdentityId: input.approverIdentityId,
      outcome: input.approved ? "success" : "blocked",
      metadata: {
        planId: plan.id,
        decisionNote: input.decisionNote
      }
    });

    this.history.record({
      requestId: request.id,
      planId: plan.id,
      blueprintId: request.blueprintId,
      action: input.approved
        ? "approval-granted"
        : "approval-rejected",
      actorIdentityId: input.approverIdentityId,
      metadata: {
        approvalId: id,
        decisionNote: input.decisionNote
      }
    });

    return updated;
  }

  approvedForPlan(planId: string) {
    return this.list().some(
      (approval) =>
        approval.planId === planId &&
        approval.status === "approved"
    );
  }

  summary() {
    const approvals = this.list();

    return {
      total: approvals.length,
      pending: approvals.filter(
        (approval) => approval.status === "pending"
      ).length,
      approved: approvals.filter(
        (approval) => approval.status === "approved"
      ).length,
      rejected: approvals.filter(
        (approval) => approval.status === "rejected"
      ).length
    };
  }
}
