import {
  ConflictException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { BrainGoal } from "../enterprise-brain-mega-pack-1.types";
import { BrainSessionService } from "../sessions/brain-session.service";
import { BrainRuntimeService } from "../runtime/brain-runtime.service";
import { BrainAuditService } from "../observability/brain-audit.service";

@Injectable()
export class BrainGoalService {
  private readonly goals =
    new Map<string, BrainGoal>();

  constructor(
    private readonly sessions: BrainSessionService,
    private readonly runtime: BrainRuntimeService,
    private readonly audit: BrainAuditService
  ) {}

  list() {
    return Array.from(this.goals.values());
  }

  get(id: string) {
    const goal = this.goals.get(id);

    if (!goal) {
      throw new NotFoundException(
        `Enterprise Brain goal not found: ${id}`
      );
    }

    return goal;
  }

  create(input: {
    sessionId: string;
    title: string;
    description: string;
    priority: BrainGoal["priority"];
    parentGoalId?: string;
    dependencies?: string[];
    constraints?: string[];
    successCriteria?: string[];
    metadata?: Record<string, unknown>;
    actorIdentityId: string;
    correlationId: string;
  }) {
    this.sessions.get(input.sessionId);

    if (input.parentGoalId) {
      this.get(input.parentGoalId);
    }

    for (const dependencyId of input.dependencies ?? []) {
      this.get(dependencyId);
    }

    const now = new Date().toISOString();

    const goal: BrainGoal = {
      id: `brain-goal:${Date.now()}:${this.goals.size + 1}`,
      sessionId: input.sessionId,
      title: input.title,
      description: input.description,
      status: "active",
      priority: input.priority,
      parentGoalId: input.parentGoalId,
      dependencies:
        Array.from(new Set(input.dependencies ?? [])),
      constraints:
        Array.from(new Set(input.constraints ?? [])),
      successCriteria:
        Array.from(new Set(input.successCriteria ?? [])),
      progress: 0,
      metadata: input.metadata ?? {},
      createdAt: now,
      updatedAt: now
    };

    this.goals.set(goal.id, goal);

    this.sessions.attach(input.sessionId, {
      goalId: goal.id
    });

    this.updateRuntime();

    this.audit.record({
      correlationId: input.correlationId,
      category: "goal",
      action: "enterprise-brain-goal-created",
      subjectId: goal.id,
      actorIdentityId: input.actorIdentityId,
      outcome: "success",
      metadata: {
        priority: goal.priority,
        dependencies: goal.dependencies
      }
    });

    return goal;
  }

  updateProgress(input: {
    goalId: string;
    progress: number;
    actorIdentityId: string;
    correlationId: string;
  }) {
    const current = this.get(input.goalId);

    const progress = Math.max(
      0,
      Math.min(100, input.progress)
    );

    const dependenciesCompleted =
      current.dependencies.every(
        (dependencyId) =>
          this.get(dependencyId).status === "completed"
      );

    if (
      progress > 0 &&
      !dependenciesCompleted
    ) {
      throw new ConflictException(
        "Enterprise Brain goal dependencies are not completed."
      );
    }

    const updated: BrainGoal = {
      ...current,
      progress,
      status:
        progress === 100
          ? "completed"
          : "active",
      completedAt:
        progress === 100
          ? new Date().toISOString()
          : undefined,
      updatedAt: new Date().toISOString()
    };

    this.goals.set(updated.id, updated);
    this.updateRuntime();

    return updated;
  }

  summary() {
    const goals = this.list();

    return {
      total: goals.length,
      active: goals.filter((x) => x.status === "active").length,
      blocked: goals.filter((x) => x.status === "blocked").length,
      completed: goals.filter((x) => x.status === "completed").length,
      critical: goals.filter((x) => x.priority === "critical").length
    };
  }

  private updateRuntime() {
    this.runtime.updateCounters({
      activeGoals:
        this.list().filter((x) => x.status === "active").length
    });
  }
}
