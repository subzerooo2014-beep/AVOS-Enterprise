import {
  ConflictException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { NervousApprovalGate } from "../enterprise-nervous-system-mega-pack-3.types";
import { NervousWorkflowAuditService } from "../observability/nervous-workflow-audit.service";

@Injectable()
export class NervousWorkflowApprovalService {
  private readonly gates =
    new Map<string, NervousApprovalGate>();

  constructor(
    private readonly audit: NervousWorkflowAuditService
  ) {}

  list() {
    return Array.from(this.gates.values());
  }

  get(id: string) {
    const gate = this.gates.get(id);

    if (!gate) {
      throw new NotFoundException(`Workflow approval gate not found: ${id}`);
    }

    return gate;
  }

  create(input: {
    executionId: string;
    stepId: string;
    reason: string;
    riskScore: number;
    requestedByIdentityId: string;
    correlationId: string;
  }) {
    const now = new Date().toISOString();

    const gate: NervousApprovalGate = {
      id: `workflow-approval:${Date.now()}:${this.gates.size + 1}`,
      executionId: input.executionId,
      stepId: input.stepId,
      reason: input.reason,
      riskScore: Math.max(0, Math.min(100, input.riskScore)),
      status: "pending",
      requestedByIdentityId: input.requestedByIdentityId,
      createdAt: now,
      updatedAt: now
    };

    this.gates.set(gate.id, gate);

    this.audit.record({
      correlationId: input.correlationId,
      category: "approval",
      action: "workflow-human-approval-requested",
      subjectId: gate.id,
      actorIdentityId: input.requestedByIdentityId,
      outcome: "warning",
      metadata: {
        executionId: gate.executionId,
        stepId: gate.stepId,
        riskScore: gate.riskScore
      }
    });

    return gate;
  }

  decide(input: {
    gateId: string;
    identityId: string;
    approve: boolean;
    note?: string;
    correlationId: string;
  }) {
    const current = this.get(input.gateId);

    if (current.status !== "pending") {
      throw new ConflictException(
        `Workflow approval gate is not pending: ${current.status}`
      );
    }

    const updated: NervousApprovalGate = {
      ...current,
      status: input.approve ? "approved" : "rejected",
      decidedByIdentityId: input.identityId,
      decisionNote: input.note,
      updatedAt: new Date().toISOString()
    };

    this.gates.set(updated.id, updated);

    this.audit.record({
      correlationId: input.correlationId,
      category: "approval",
      action: input.approve
        ? "workflow-human-approval-approved"
        : "workflow-human-approval-rejected",
      subjectId: updated.id,
      actorIdentityId: input.identityId,
      outcome: input.approve ? "success" : "blocked",
      metadata: {
        executionId: updated.executionId,
        stepId: updated.stepId
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
      rejected: items.filter((x) => x.status === "rejected").length
    };
  }
}
