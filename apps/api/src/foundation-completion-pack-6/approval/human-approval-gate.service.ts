import { Injectable, NotFoundException } from "@nestjs/common";
import { HumanApprovalRequest } from "../foundation-pack-6.types";
import { EnterpriseEventBackboneService } from "../events/enterprise-event-backbone.service";
import { NervousSystemTraceService } from "../observability/nervous-system-trace.service";

@Injectable()
export class HumanApprovalGateService {
  private readonly requests = new Map<string, HumanApprovalRequest>();

  constructor(
    private readonly events: EnterpriseEventBackboneService,
    private readonly trace: NervousSystemTraceService
  ) {}

  list() {
    return Array.from(this.requests.values());
  }

  get(id: string) {
    const request = this.requests.get(id);

    if (!request) {
      throw new NotFoundException(`Approval request not found: ${id}`);
    }

    return request;
  }

  request(input: {
    planId: string;
    stepId: string;
    requestedByIdentityId: string;
    requiredRole: string;
    reason: string;
    correlationId: string;
    expiresAt?: string;
  }) {
    const request: HumanApprovalRequest = {
      id: `human-approval:${Date.now()}:${this.requests.size + 1}`,
      planId: input.planId,
      stepId: input.stepId,
      requestedByIdentityId: input.requestedByIdentityId,
      requiredRole: input.requiredRole,
      reason: input.reason,
      status: "pending",
      requestedAt: new Date().toISOString(),
      expiresAt: input.expiresAt
    };

    this.requests.set(request.id, request);

    this.events.publish({
      eventType: "avos.human-approval.requested",
      eventVersion: "1.0.0",
      sourceCapabilityId: "capability:human-approval",
      sourceIdentityId: input.requestedByIdentityId,
      subjectId: request.id,
      correlationId: input.correlationId,
      priority: "high",
      payload: {
        approvalRequestId: request.id,
        planId: request.planId,
        stepId: request.stepId,
        requiredRole: request.requiredRole,
        reason: request.reason
      }
    });

    this.trace.record({
      correlationId: input.correlationId,
      category: "approval",
      action: "approval-requested",
      subjectId: request.id,
      actorIdentityId: input.requestedByIdentityId,
      outcome: "pending",
      metadata: {
        planId: request.planId,
        stepId: request.stepId,
        requiredRole: request.requiredRole
      }
    });

    return request;
  }

  decide(
    id: string,
    input: {
      approved: boolean;
      approverIdentityId: string;
      decisionNote: string;
      correlationId: string;
    }
  ) {
    const current = this.get(id);

    if (current.status !== "pending") {
      throw new Error(`Approval request is not pending: ${id}`);
    }

    const updated: HumanApprovalRequest = {
      ...current,
      status: input.approved ? "approved" : "rejected",
      approverIdentityId: input.approverIdentityId,
      decisionNote: input.decisionNote,
      decidedAt: new Date().toISOString()
    };

    this.requests.set(id, updated);

    this.trace.record({
      correlationId: input.correlationId,
      category: "approval",
      action: input.approved ? "approval-granted" : "approval-rejected",
      subjectId: updated.id,
      actorIdentityId: input.approverIdentityId,
      outcome: input.approved ? "success" : "blocked",
      metadata: {
        planId: updated.planId,
        stepId: updated.stepId,
        decisionNote: updated.decisionNote
      }
    });

    return updated;
  }

  byPlan(planId: string) {
    return this.list().filter((request) => request.planId === planId);
  }

  approvedForStep(planId: string, stepId: string) {
    return this.list().some(
      (request) =>
        request.planId === planId &&
        request.stepId === stepId &&
        request.status === "approved"
    );
  }

  summary() {
    const requests = this.list();

    return {
      total: requests.length,
      pending: requests.filter((request) => request.status === "pending")
        .length,
      approved: requests.filter(
        (request) => request.status === "approved"
      ).length,
      rejected: requests.filter(
        (request) => request.status === "rejected"
      ).length
    };
  }
}
