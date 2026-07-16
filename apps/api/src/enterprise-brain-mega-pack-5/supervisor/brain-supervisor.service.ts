import {
  ConflictException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { BrainSupervisorDecision } from "../enterprise-brain-mega-pack-5.types";
import { BrainAgentRegistryService } from "../agents/brain-agent-registry.service";
import { BrainCoordinationRuntimeService } from "../coordination/brain-coordination-runtime.service";
import { BrainMultiAgentAuditService } from "../observability/brain-multi-agent-audit.service";

@Injectable()
export class BrainSupervisorService {
  private readonly decisions = new Map<string, BrainSupervisorDecision>();

  constructor(
    private readonly agents: BrainAgentRegistryService,
    private readonly coordination: BrainCoordinationRuntimeService,
    private readonly audit: BrainMultiAgentAuditService
  ) {}

  list() {
    return Array.from(this.decisions.values());
  }

  get(id: string) {
    const decision = this.decisions.get(id);

    if (!decision) {
      throw new NotFoundException(`Brain supervisor decision not found: ${id}`);
    }

    return decision;
  }

  propose(input: {
    subjectId: string;
    action: BrainSupervisorDecision["action"];
    targetAgentId?: string;
    targetTaskId?: string;
    rationale: string;
    confidence: number;
    riskScore: number;
    actorIdentityId: string;
    correlationId: string;
  }) {
    if (input.targetAgentId) {
      this.agents.get(input.targetAgentId);
    }

    const now = new Date().toISOString();

    const decision: BrainSupervisorDecision = {
      id: `brain-supervisor-decision:${Date.now()}:${this.decisions.size + 1}`,
      subjectId: input.subjectId,
      action: input.action,
      targetAgentId: input.targetAgentId,
      targetTaskId: input.targetTaskId,
      rationale: input.rationale,
      confidence: Math.max(0, Math.min(100, input.confidence)),
      riskScore: Math.max(0, Math.min(100, input.riskScore)),
      requiresHumanApproval:
        input.riskScore >= 70 ||
        input.action === "reject" ||
        input.action === "escalate",
      status: "proposed",
      correlationId: input.correlationId,
      createdAt: now,
      updatedAt: now
    };

    this.decisions.set(decision.id, decision);

    this.audit.record({
      correlationId: input.correlationId,
      category: "supervisor",
      action: "brain-supervisor-decision-proposed",
      subjectId: decision.id,
      actorIdentityId: input.actorIdentityId,
      outcome:
        decision.requiresHumanApproval
          ? "warning"
          : "success",
      metadata: {
        action: decision.action,
        riskScore: decision.riskScore
      }
    });

    return decision;
  }

  approve(input: {
    decisionId: string;
    approvedByIdentityId: string;
    approve: boolean;
  }) {
    const current = this.get(input.decisionId);

    const updated: BrainSupervisorDecision = {
      ...current,
      approvedByIdentityId:
        input.approve
          ? input.approvedByIdentityId
          : undefined,
      status: input.approve ? "approved" : "rejected",
      updatedAt: new Date().toISOString()
    };

    this.decisions.set(updated.id, updated);
    return updated;
  }

  execute(input: {
    decisionId: string;
    actorIdentityId: string;
  }) {
    const current = this.get(input.decisionId);

    if (
      current.requiresHumanApproval &&
      !current.approvedByIdentityId
    ) {
      throw new ConflictException(
        "Supervisor decision requires human approval."
      );
    }

    if (current.targetAgentId) {
      switch (current.action) {
        case "pause":
          this.agents.updateStatus(current.targetAgentId, "paused");
          break;
        case "resume":
          this.agents.updateStatus(current.targetAgentId, "ready");
          break;
        case "reject":
          this.agents.updateStatus(current.targetAgentId, "blocked");
          break;
        case "recover":
          this.agents.updateStatus(current.targetAgentId, "ready");
          break;
      }
    }

    const updated: BrainSupervisorDecision = {
      ...current,
      status: "executed",
      updatedAt: new Date().toISOString()
    };

    this.decisions.set(updated.id, updated);
    return updated;
  }

  summary() {
    const items = this.list();

    return {
      total: items.length,
      proposed: items.filter((x) => x.status === "proposed").length,
      approved: items.filter((x) => x.status === "approved").length,
      rejected: items.filter((x) => x.status === "rejected").length,
      executed: items.filter((x) => x.status === "executed").length,
      approvalRequired:
        items.filter((x) => x.requiresHumanApproval).length
    };
  }
}
