import {
  ConflictException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { KernelApprovalRequest } from "../enterprise-kernel-mega-pack-3.types";
import { KernelAuthorizationService } from "../authorization/kernel-authorization.service";
import { KernelPrincipalRegistryService } from "../authorization/kernel-principal-registry.service";
import { KernelSecurityAuditService } from "../observability/kernel-security-audit.service";

@Injectable()
export class KernelApprovalService {
  private readonly approvals =
    new Map<string, KernelApprovalRequest>();

  constructor(
    private readonly authorization: KernelAuthorizationService,
    private readonly principals: KernelPrincipalRegistryService,
    private readonly audit: KernelSecurityAuditService
  ) {}

  list() {
    return Array.from(this.approvals.values());
  }

  get(id: string) {
    const approval = this.approvals.get(id);

    if (!approval) {
      throw new NotFoundException(
        `Kernel approval request not found: ${id}`
      );
    }

    return approval;
  }

  request(input: {
    authorizationDecisionId: string;
    executionRequestId?: string;
    requestedByPrincipalId: string;
    approverIdentityIds: string[];
    reason: string;
    risk: KernelApprovalRequest["risk"];
    expiresAt?: string;
    correlationId: string;
  }) {
    const decision =
      this.authorization.getDecision(
        input.authorizationDecisionId
      );

    this.principals.get(
      input.requestedByPrincipalId
    );

    if (!decision.requiresHumanApproval) {
      throw new ConflictException(
        "Authorization decision does not require human approval."
      );
    }

    for (const approverId of input.approverIdentityIds) {
      const approver = this.principals.get(
        approverId
      );

      if (approver.type !== "human") {
        throw new ConflictException(
          `Kernel approver must be human: ${approverId}`
        );
      }
    }

    const approval: KernelApprovalRequest = {
      id: `kernel-approval:${Date.now()}:${
        this.approvals.size + 1
      }`,
      authorizationDecisionId:
        input.authorizationDecisionId,
      executionRequestId:
        input.executionRequestId,
      requestedByPrincipalId:
        input.requestedByPrincipalId,
      approverIdentityIds:
        Array.from(
          new Set(input.approverIdentityIds)
        ),
      status: "pending",
      reason: input.reason,
      risk: input.risk,
      expiresAt: input.expiresAt,
      createdAt: new Date().toISOString()
    };

    this.approvals.set(approval.id, approval);

    this.audit.record({
      correlationId: input.correlationId,
      category: "approval",
      action: "kernel-approval-requested",
      subjectId: approval.id,
      actorIdentityId:
        input.requestedByPrincipalId,
      outcome: "warning",
      metadata: {
        risk: approval.risk,
        approvers:
          approval.approverIdentityIds
      }
    });

    return approval;
  }

  decide(input: {
    approvalId: string;
    approverIdentityId: string;
    approve: boolean;
    reason: string;
    correlationId: string;
  }) {
    const current = this.get(
      input.approvalId
    );

    if (current.status !== "pending") {
      throw new ConflictException(
        `Kernel approval is not pending: ${current.id}`
      );
    }

    if (
      !current.approverIdentityIds.includes(
        input.approverIdentityId
      )
    ) {
      throw new ConflictException(
        `Identity is not an authorized approver: ${input.approverIdentityId}`
      );
    }

    const approver =
      this.principals.get(
        input.approverIdentityId
      );

    if (approver.type !== "human") {
      throw new ConflictException(
        "Kernel approval must be decided by a human identity."
      );
    }

    const updated: KernelApprovalRequest = {
      ...current,
      status: input.approve
        ? "approved"
        : "rejected",
      approvedByIdentityId:
        input.approve
          ? input.approverIdentityId
          : undefined,
      rejectedByIdentityId:
        input.approve
          ? undefined
          : input.approverIdentityId,
      decisionReason: input.reason,
      decidedAt: new Date().toISOString()
    };

    this.approvals.set(
      updated.id,
      updated
    );

    this.audit.record({
      correlationId: input.correlationId,
      category: "approval",
      action: input.approve
        ? "kernel-approval-approved"
        : "kernel-approval-rejected",
      subjectId: updated.id,
      actorIdentityId:
        input.approverIdentityId,
      outcome: input.approve
        ? "success"
        : "blocked",
      metadata: {
        reason: input.reason
      }
    });

    return updated;
  }

  summary() {
    const approvals = this.list();

    return {
      total: approvals.length,
      pending: approvals.filter(
        (approval) =>
          approval.status === "pending"
      ).length,
      approved: approvals.filter(
        (approval) =>
          approval.status === "approved"
      ).length,
      rejected: approvals.filter(
        (approval) =>
          approval.status === "rejected"
      ).length
    };
  }
}
