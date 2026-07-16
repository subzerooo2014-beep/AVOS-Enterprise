import {
  ConflictException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import {
  BrainConsensusSession,
  BrainConsensusVote
} from "../enterprise-brain-mega-pack-5.types";
import { BrainAgentRegistryService } from "../agents/brain-agent-registry.service";
import { BrainMultiAgentAuditService } from "../observability/brain-multi-agent-audit.service";

@Injectable()
export class BrainConsensusService {
  private readonly sessions = new Map<string, BrainConsensusSession>();

  constructor(
    private readonly agents: BrainAgentRegistryService,
    private readonly audit: BrainMultiAgentAuditService
  ) {}

  list() {
    return Array.from(this.sessions.values());
  }

  get(id: string) {
    const session = this.sessions.get(id);

    if (!session) {
      throw new NotFoundException(`Brain consensus session not found: ${id}`);
    }

    return session;
  }

  create(input: {
    subjectId: string;
    question: string;
    optionIds: string[];
    requiredAgentIds: string[];
    minimumParticipation: number;
    approvalThreshold: number;
    requiresHumanApproval: boolean;
    actorIdentityId: string;
    correlationId: string;
  }) {
    for (const id of input.requiredAgentIds) {
      this.agents.get(id);
    }

    const now = new Date().toISOString();

    const session: BrainConsensusSession = {
      id: `brain-consensus:${Date.now()}:${this.sessions.size + 1}`,
      subjectId: input.subjectId,
      question: input.question,
      optionIds: Array.from(new Set(input.optionIds)),
      requiredAgentIds:
        Array.from(new Set(input.requiredAgentIds)),
      minimumParticipation:
        Math.max(1, input.minimumParticipation),
      approvalThreshold:
        Math.max(1, Math.min(100, input.approvalThreshold)),
      votes: [],
      conditions: [],
      status: "open",
      requiresHumanApproval: input.requiresHumanApproval,
      correlationId: input.correlationId,
      createdAt: now,
      updatedAt: now
    };

    this.sessions.set(session.id, session);
    return session;
  }

  vote(input: {
    consensusId: string;
    agentId: string;
    optionId: string;
    confidence: number;
    rationale: string;
    conditions?: string[];
  }) {
    const current = this.get(input.consensusId);

    if (current.status !== "open") {
      throw new ConflictException(
        `Consensus session is not open: ${current.status}`
      );
    }

    if (!current.requiredAgentIds.includes(input.agentId)) {
      throw new ConflictException(
        `Agent is not a required voter: ${input.agentId}`
      );
    }

    if (!current.optionIds.includes(input.optionId)) {
      throw new ConflictException(
        `Consensus option does not exist: ${input.optionId}`
      );
    }

    if (current.votes.some((vote) => vote.agentId === input.agentId)) {
      throw new ConflictException(
        `Agent already voted: ${input.agentId}`
      );
    }

    const vote: BrainConsensusVote = {
      id: `brain-consensus-vote:${Date.now()}:${current.votes.length + 1}`,
      consensusId: current.id,
      agentId: input.agentId,
      optionId: input.optionId,
      confidence: Math.max(0, Math.min(100, input.confidence)),
      rationale: input.rationale,
      conditions: Array.from(new Set(input.conditions ?? [])),
      createdAt: new Date().toISOString()
    };

    const updated: BrainConsensusSession = {
      ...current,
      votes: [...current.votes, vote],
      updatedAt: new Date().toISOString()
    };

    this.sessions.set(updated.id, updated);
    return vote;
  }

  decide(input: {
    consensusId: string;
    actorIdentityId: string;
    correlationId: string;
  }) {
    const current = this.get(input.consensusId);

    const participation = current.votes.length;

    if (participation < current.minimumParticipation) {
      throw new ConflictException(
        "Consensus minimum participation has not been reached."
      );
    }

    const optionScores = current.optionIds.map((optionId) => {
      const votes = current.votes.filter(
        (vote) => vote.optionId === optionId
      );

      const weightedScore =
        votes.reduce(
          (sum, vote) => sum + vote.confidence,
          0
        );

      const share =
        current.votes.length === 0
          ? 0
          : votes.length / current.votes.length * 100;

      return {
        optionId,
        votes: votes.length,
        share,
        weightedScore,
        conditions:
          Array.from(
            new Set(votes.flatMap((vote) => vote.conditions))
          )
      };
    })
    .sort(
      (left, right) =>
        right.weightedScore - left.weightedScore
    );

    const selected = optionScores[0];

    const decision: BrainConsensusSession["decision"] =
      !selected
        ? "deadlock"
        : selected.share >= current.approvalThreshold
          ? selected.conditions.length > 0
            ? "approved-with-conditions"
            : "approved"
          : "deadlock";

    const updated: BrainConsensusSession = {
      ...current,
      decision,
      selectedOptionId:
        decision === "deadlock"
          ? undefined
          : selected?.optionId,
      conditions:
        decision === "deadlock"
          ? []
          : selected?.conditions ?? [],
      status:
        decision === "deadlock"
          ? "deadlock"
          : "decided",
      updatedAt: new Date().toISOString()
    };

    this.sessions.set(updated.id, updated);

    this.audit.record({
      correlationId: input.correlationId,
      category: "consensus",
      action: "brain-consensus-decided",
      subjectId: updated.id,
      actorIdentityId: input.actorIdentityId,
      outcome:
        decision === "deadlock"
          ? "warning"
          : "success",
      metadata: {
        decision,
        selectedOptionId: updated.selectedOptionId
      }
    });

    return updated;
  }

  approveHuman(input: {
    consensusId: string;
    approvedByIdentityId: string;
    approve: boolean;
  }) {
    const current = this.get(input.consensusId);

    if (!current.requiresHumanApproval) {
      return current;
    }

    const updated: BrainConsensusSession = {
      ...current,
      approvedByIdentityId:
        input.approve
          ? input.approvedByIdentityId
          : undefined,
      decision:
        input.approve
          ? current.decision
          : "rejected",
      updatedAt: new Date().toISOString()
    };

    this.sessions.set(updated.id, updated);
    return updated;
  }

  summary() {
    const items = this.list();

    return {
      total: items.length,
      open: items.filter((x) => x.status === "open").length,
      decided: items.filter((x) => x.status === "decided").length,
      deadlock: items.filter((x) => x.status === "deadlock").length,
      approvalRequired:
        items.filter((x) => x.requiresHumanApproval).length
    };
  }
}
