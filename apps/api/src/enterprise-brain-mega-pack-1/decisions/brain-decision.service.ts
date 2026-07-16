import {
  ConflictException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import {
  BrainDecisionOption,
  BrainDecisionRequest
} from "../enterprise-brain-mega-pack-1.types";
import { BrainSessionService } from "../sessions/brain-session.service";
import { BrainGoalService } from "../goals/brain-goal.service";
import { BrainContextService } from "../context/brain-context.service";
import { BrainRuntimeService } from "../runtime/brain-runtime.service";
import { BrainAuditService } from "../observability/brain-audit.service";

@Injectable()
export class BrainDecisionService {
  private readonly decisions =
    new Map<string, BrainDecisionRequest>();

  constructor(
    private readonly sessions: BrainSessionService,
    private readonly goals: BrainGoalService,
    private readonly context: BrainContextService,
    private readonly runtime: BrainRuntimeService,
    private readonly audit: BrainAuditService
  ) {}

  list() {
    return Array.from(this.decisions.values());
  }

  get(id: string) {
    const decision = this.decisions.get(id);

    if (!decision) {
      throw new NotFoundException(
        `Enterprise Brain decision not found: ${id}`
      );
    }

    return decision;
  }

  request(input: {
    sessionId: string;
    goalId?: string;
    question: string;
    contextIds?: string[];
    options: Array<Omit<BrainDecisionOption, "id" | "score" | "confidence"> & {
      score?: number;
      confidence?: number;
    }>;
    requiresHumanApproval: boolean;
    actorIdentityId: string;
    correlationId: string;
  }) {
    this.sessions.get(input.sessionId);

    if (input.goalId) {
      this.goals.get(input.goalId);
    }

    for (const contextId of input.contextIds ?? []) {
      this.context.get(contextId);
    }

    if (input.options.length < 1) {
      throw new ConflictException(
        "Enterprise Brain decision requires at least one option."
      );
    }

    const now = new Date().toISOString();

    const options: BrainDecisionOption[] =
      input.options.map((option, index) => ({
        ...option,
        id: `brain-decision-option:${Date.now()}:${index + 1}`,
        score: Math.max(
          0,
          Math.min(
            100,
            option.score ??
            this.scoreOption(option)
          )
        ),
        confidence: Math.max(
          0,
          Math.min(
            100,
            option.confidence ?? 80
          )
        )
      }));

    const decision: BrainDecisionRequest = {
      id: `brain-decision:${Date.now()}:${this.decisions.size + 1}`,
      sessionId: input.sessionId,
      goalId: input.goalId,
      question: input.question,
      contextIds:
        Array.from(new Set(input.contextIds ?? [])),
      options,
      status: "requested",
      requiresHumanApproval:
        input.requiresHumanApproval,
      createdAt: now,
      updatedAt: now
    };

    this.decisions.set(decision.id, decision);

    this.sessions.attach(input.sessionId, {
      decisionId: decision.id
    });

    this.updateRuntime();

    this.audit.record({
      correlationId: input.correlationId,
      category: "decision",
      action: "enterprise-brain-decision-requested",
      subjectId: decision.id,
      actorIdentityId: input.actorIdentityId,
      outcome: input.requiresHumanApproval
        ? "warning"
        : "success",
      metadata: {
        options: options.length,
        requiresHumanApproval:
          input.requiresHumanApproval
      }
    });

    return decision;
  }

  analyze(input: {
    decisionId: string;
    actorIdentityId: string;
    correlationId: string;
  }) {
    const current = this.get(input.decisionId);

    const selected = [...current.options]
      .sort(
        (left, right) =>
          (
            right.score *
            right.confidence
          ) -
          (
            left.score *
            left.confidence
          )
      )[0];

    if (!selected) {
      throw new ConflictException(
        "Enterprise Brain decision contains no options."
      );
    }

    const riskScore = Math.max(
      0,
      Math.min(
        100,
        selected.risks.length * 15
      )
    );

    const updated: BrainDecisionRequest = {
      ...current,
      selectedOptionId: selected.id,
      rationale:
        `Selected option "${selected.title}" based on weighted score and confidence.`,
      confidence: selected.confidence,
      riskScore,
      status:
        current.requiresHumanApproval
          ? "waiting-human-approval"
          : "completed",
      completedAt:
        current.requiresHumanApproval
          ? undefined
          : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.decisions.set(updated.id, updated);
    this.updateRuntime();

    return updated;
  }

  decideHumanApproval(input: {
    decisionId: string;
    identityId: string;
    approve: boolean;
    correlationId: string;
  }) {
    const current = this.get(input.decisionId);

    if (
      current.status !==
      "waiting-human-approval"
    ) {
      throw new ConflictException(
        `Enterprise Brain decision is not waiting for approval: ${current.status}`
      );
    }

    const updated: BrainDecisionRequest = {
      ...current,
      status: input.approve
        ? "completed"
        : "rejected",
      approvedByIdentityId:
        input.approve
          ? input.identityId
          : undefined,
      rejectedByIdentityId:
        input.approve
          ? undefined
          : input.identityId,
      completedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.decisions.set(updated.id, updated);
    this.updateRuntime();

    return updated;
  }

  summary() {
    const decisions = this.list();

    return {
      total: decisions.length,
      pending: decisions.filter(
        (x) =>
          x.status === "requested" ||
          x.status === "analyzing"
      ).length,
      waitingHumanApproval:
        decisions.filter(
          (x) =>
            x.status === "waiting-human-approval"
        ).length,
      completed:
        decisions.filter(
          (x) =>
            x.status === "completed"
        ).length,
      rejected:
        decisions.filter(
          (x) =>
            x.status === "rejected"
        ).length
    };
  }

  private scoreOption(
    option: {
      benefits: string[];
      risks: string[];
    }
  ) {
    return Math.max(
      0,
      Math.min(
        100,
        60 +
        option.benefits.length * 10 -
        option.risks.length * 8
      )
    );
  }

  private updateRuntime() {
    this.runtime.updateCounters({
      pendingDecisions:
        this.list().filter(
          (x) =>
            x.status === "requested" ||
            x.status === "analyzing" ||
            x.status ===
              "waiting-human-approval"
        ).length
    });
  }
}
