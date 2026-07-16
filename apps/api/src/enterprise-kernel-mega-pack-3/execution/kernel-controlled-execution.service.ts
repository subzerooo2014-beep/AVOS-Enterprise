import {
  ConflictException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import {
  KernelExecutionRecord,
  KernelExecutionRequest
} from "../enterprise-kernel-mega-pack-3.types";
import { KernelAuthorizationService } from "../authorization/kernel-authorization.service";
import { KernelApprovalService } from "../approvals/kernel-approval.service";
import { KernelExecutionGuardService } from "../guards/kernel-execution-guard.service";
import { KernelSecurityAuditService } from "../observability/kernel-security-audit.service";

@Injectable()
export class KernelControlledExecutionService {
  private readonly records =
    new Map<string, KernelExecutionRecord>();

  constructor(
    private readonly authorization: KernelAuthorizationService,
    private readonly approvals: KernelApprovalService,
    private readonly guard: KernelExecutionGuardService,
    private readonly audit: KernelSecurityAuditService
  ) {}

  list() {
    return Array.from(this.records.values());
  }

  get(id: string) {
    const record = this.records.get(id);

    if (!record) {
      throw new NotFoundException(
        `Kernel execution record not found: ${id}`
      );
    }

    return record;
  }

  request(input: Omit<KernelExecutionRequest, "id" | "requestedAt">) {
    const request: KernelExecutionRequest = {
      ...input,
      id: `kernel-execution-request:${Date.now()}:${
        this.records.size + 1
      }`,
      requestedAt: new Date().toISOString()
    };

    const authorization =
      this.authorization.authorize({
        principalId: request.principalId,
        resource: request.resource,
        action: request.action,
        risk: request.risk,
        context: request.payload,
        correlationId:
          request.correlationId
      });

    let approvalRequestId:
      | string
      | undefined;

    let status: KernelExecutionRecord["status"];

    if (authorization.decision === "deny") {
      status = "blocked";
    }
    else if (
      authorization.requiresHumanApproval
    ) {
      const approval =
        this.approvals.request({
          authorizationDecisionId:
            authorization.id,
          executionRequestId:
            request.id,
          requestedByPrincipalId:
            request.principalId,
          approverIdentityIds: [
            "human:khalifa"
          ],
          reason:
            "Kernel critical execution approval.",
          risk: request.risk,
          correlationId:
            request.correlationId
        });

      approvalRequestId = approval.id;
      status = "waiting-approval";
    }
    else {
      const guard = this.guard.evaluate({
        request,
        authorization
      });

      status = guard.allowed
        ? "authorized"
        : "blocked";
    }

    const record: KernelExecutionRecord = {
      id: `kernel-execution:${Date.now()}:${
        this.records.size + 1
      }`,
      request,
      authorizationDecisionId:
        authorization.id,
      approvalRequestId,
      status,
      updatedAt: new Date().toISOString()
    };

    this.records.set(record.id, record);

    this.audit.record({
      correlationId: request.correlationId,
      category: "execution",
      action: "kernel-execution-request-created",
      subjectId: record.id,
      actorIdentityId:
        request.principalId,
      outcome:
        status === "blocked"
          ? "blocked"
          : status === "waiting-approval"
            ? "warning"
            : "success",
      metadata: {
        status,
        risk: request.risk,
        reversible: request.reversible
      }
    });

    return record;
  }

  execute(input: {
    executionId: string;
    actorIdentityId: string;
    correlationId: string;
  }) {
    const current = this.get(
      input.executionId
    );

    if (
      current.status === "waiting-approval"
    ) {
      if (!current.approvalRequestId) {
        throw new ConflictException(
          "Kernel execution approval reference is missing."
        );
      }

      const approval =
        this.approvals.get(
          current.approvalRequestId
        );

      if (approval.status !== "approved") {
        throw new ConflictException(
          `Kernel execution approval is not approved: ${approval.status}`
        );
      }
    }
    else if (
      current.status !== "authorized"
    ) {
      throw new ConflictException(
        `Kernel execution cannot start from status: ${current.status}`
      );
    }

    const running: KernelExecutionRecord = {
      ...current,
      status: "running",
      startedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.records.set(running.id, running);

    try {
      const result = {
        executed: true,
        resource: running.request.resource,
        action: running.request.action,
        payload: running.request.payload
      };

      const completed: KernelExecutionRecord = {
        ...running,
        status: "completed",
        result,
        completedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      this.records.set(
        completed.id,
        completed
      );

      this.audit.record({
        correlationId:
          input.correlationId,
        category: "execution",
        action: "kernel-execution-completed",
        subjectId: completed.id,
        actorIdentityId:
          input.actorIdentityId,
        outcome: "success",
        metadata: {
          resource:
            completed.request.resource,
          action:
            completed.request.action
        }
      });

      return completed;
    }
    catch (error) {
      const failed: KernelExecutionRecord = {
        ...running,
        status: "failed",
        error:
          error instanceof Error
            ? error.message
            : String(error),
        completedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      this.records.set(failed.id, failed);
      return failed;
    }
  }

  compensate(input: {
    executionId: string;
    actorIdentityId: string;
    correlationId: string;
    reason: string;
  }) {
    const current = this.get(
      input.executionId
    );

    if (!current.request.reversible) {
      throw new ConflictException(
        "Kernel execution is not reversible."
      );
    }

    if (
      current.status !== "completed" &&
      current.status !== "failed"
    ) {
      throw new ConflictException(
        `Kernel execution cannot be compensated from status: ${current.status}`
      );
    }

    const compensating: KernelExecutionRecord = {
      ...current,
      status: "compensating",
      updatedAt: new Date().toISOString()
    };

    this.records.set(
      compensating.id,
      compensating
    );

    const compensated: KernelExecutionRecord = {
      ...compensating,
      status: "compensated",
      compensationResult: {
        compensated: true,
        reason: input.reason,
        payload:
          current.request.compensationPayload ??
          {}
      },
      completedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.records.set(
      compensated.id,
      compensated
    );

    this.audit.record({
      correlationId: input.correlationId,
      category: "execution",
      action: "kernel-execution-compensated",
      subjectId: compensated.id,
      actorIdentityId:
        input.actorIdentityId,
      outcome: "success",
      metadata: {
        reason: input.reason
      }
    });

    return compensated;
  }

  summary() {
    const records = this.list();

    return {
      total: records.length,
      authorized: records.filter(
        (record) =>
          record.status === "authorized"
      ).length,
      waitingApproval: records.filter(
        (record) =>
          record.status === "waiting-approval"
      ).length,
      completed: records.filter(
        (record) =>
          record.status === "completed"
      ).length,
      failed: records.filter(
        (record) =>
          record.status === "failed"
      ).length,
      blocked: records.filter(
        (record) =>
          record.status === "blocked"
      ).length,
      compensated: records.filter(
        (record) =>
          record.status === "compensated"
      ).length
    };
  }
}
