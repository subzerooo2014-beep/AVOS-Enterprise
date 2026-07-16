import {
  ConflictException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { BrainApprovalRequest } from "../enterprise-brain-mega-pack-6.types";
import { BrainTrustAuditService } from "../observability/brain-trust-audit.service";

@Injectable()
export class BrainHumanApprovalService {
  private readonly requests = new Map<string, BrainApprovalRequest>();

  constructor(
    private readonly audit: BrainTrustAuditService
  ) {}

  list() {
    return Array.from(this.requests.values());
  }

  get(id: string) {
    const request = this.requests.get(id);

    if (!request) {
      throw new NotFoundException(`Brain approval request not found: ${id}`);
    }

    return request;
  }

  create(input: {
    subjectId: string;
    action: string;
    reason: string;
    riskScore: number;
    requestedByIdentityId: string;
    requiredApproverRole: string;
    expiresAt?: string;
    correlationId: string;
  }) {
    const now = new Date().toISOString();

    const request: BrainApprovalRequest = {
      id: `brain-approval:${Date.now()}:${this.requests.size + 1}`,
      subjectId: input.subjectId,
      action: input.action,
      reason: input.reason,
      riskScore: Math.max(0, Math.min(100, input.riskScore)),
      requestedByIdentityId: input.requestedByIdentityId,
      requiredApproverRole: input.requiredApproverRole,
      status: "pending",
      expiresAt: input.expiresAt,
      createdAt: now,
      updatedAt: now
    };

    this.requests.set(request.id, request);

    this.audit.record({
      correlationId: input.correlationId,
      category: "approval",
      action: "brain-human-approval-requested",
      subjectId: request.id,
      actorIdentityId: input.requestedByIdentityId,
      outcome: "warning",
      metadata: {
        action: request.action,
        riskScore: request.riskScore
      }
    });

    return request;
  }

  decide(input: {
    approvalId: string;
    identityId: string;
    approve: boolean;
    note?: string;
    correlationId: string;
  }) {
    const current = this.get(input.approvalId);

    if (current.status !== "pending") {
      throw new ConflictException(
        `Brain approval is not pending: ${current.status}`
      );
    }

    if (
      current.expiresAt &&
      new Date(current.expiresAt).getTime() <= Date.now()
    ) {
      const expired: BrainApprovalRequest = {
        ...current,
        status: "expired",
        updatedAt: new Date().toISOString()
      };

      this.requests.set(expired.id, expired);
      return expired;
    }

    const updated: BrainApprovalRequest = {
      ...current,
      status: input.approve ? "approved" : "rejected",
      approvedByIdentityId:
        input.approve
          ? input.identityId
          : undefined,
      rejectedByIdentityId:
        input.approve
          ? undefined
          : input.identityId,
      decisionNote: input.note,
      updatedAt: new Date().toISOString()
    };

    this.requests.set(updated.id, updated);

    this.audit.record({
      correlationId: input.correlationId,
      category: "approval",
      action: input.approve
        ? "brain-human-approval-approved"
        : "brain-human-approval-rejected",
      subjectId: updated.id,
      actorIdentityId: input.identityId,
      outcome: input.approve ? "success" : "blocked",
      metadata: {
        action: updated.action
      }
    });

    return updated;
  }

  summary() {
    const items = this.list();

    return {
      total: items.length,
      pending: items.filter((x) => x.status === "pending").length,
      approved: items.filter((x) => x.status === "approved").length,
      rejected: items.filter((x) => x.status === "rejected").length,
      expired: items.filter((x) => x.status === "expired").length
    };
  }
}
