import {
  ConflictException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import {
  BrainExecutionPlan,
  BrainPlanTask
} from "../enterprise-brain-mega-pack-3.types";
import { BrainReasoningEngineService } from "../reasoning/brain-reasoning-engine.service";
import { BrainReasoningAuditService } from "../observability/brain-reasoning-audit.service";

@Injectable()
export class BrainPlanningEngineService {
  private readonly plans = new Map<string, BrainExecutionPlan>();

  constructor(
    private readonly reasoning: BrainReasoningEngineService,
    private readonly audit: BrainReasoningAuditService
  ) {}

  list() {
    return Array.from(this.plans.values());
  }

  get(id: string) {
    const plan = this.plans.get(id);

    if (!plan) {
      throw new NotFoundException(`Brain execution plan not found: ${id}`);
    }

    return plan;
  }

  create(input: {
    goalId: string;
    name: string;
    description: string;
    strategy: string;
    tasks: Array<Omit<
      BrainPlanTask,
      "status" | "startedAt" | "completedAt" | "result" | "error"
    >>;
    reversible: boolean;
    createdByIdentityId: string;
    correlationId: string;
    traceId?: string;
  }) {
    const ids = new Set(input.tasks.map((task) => task.id));

    if (ids.size !== input.tasks.length) {
      throw new ConflictException("Brain plan contains duplicate task ids.");
    }

    for (const task of input.tasks) {
      for (const dependencyId of task.dependencies) {
        if (!ids.has(dependencyId)) {
          throw new ConflictException(
            `Brain plan dependency not found: ${dependencyId}`
          );
        }
      }
    }

    const now = new Date().toISOString();

    const plan: BrainExecutionPlan = {
      id: `brain-execution-plan:${Date.now()}:${this.plans.size + 1}`,
      goalId: input.goalId,
      name: input.name,
      description: input.description,
      strategy: input.strategy,
      tasks: input.tasks
        .map((task) => ({
          ...task,
          dependencies: Array.from(new Set(task.dependencies)),
          constraints: Array.from(new Set(task.constraints)),
          requiredCapabilities:
            Array.from(new Set(task.requiredCapabilities)),
          status: "pending" as const
        }))
        .sort((left, right) => left.order - right.order),
      status: "ready",
      progress: 0,
      reversible: input.reversible,
      correlationId: input.correlationId,
      traceId: input.traceId ?? `brain-plan-trace:${Date.now()}`,
      createdByIdentityId: input.createdByIdentityId,
      createdAt: now,
      updatedAt: now
    };

    this.plans.set(plan.id, plan);

    this.audit.record({
      correlationId: input.correlationId,
      category: "planning",
      action: "brain-execution-plan-created",
      subjectId: plan.id,
      actorIdentityId: input.createdByIdentityId,
      outcome: "success",
      metadata: {
        tasks: plan.tasks.length,
        reversible: plan.reversible
      }
    });

    return plan;
  }

  approve(input: {
    planId: string;
    approvedByIdentityId: string;
    correlationId: string;
  }) {
    const current = this.get(input.planId);

    const updated: BrainExecutionPlan = {
      ...current,
      approvedByIdentityId: input.approvedByIdentityId,
      status: "ready",
      updatedAt: new Date().toISOString()
    };

    this.plans.set(updated.id, updated);
    return updated;
  }

  execute(input: {
    planId: string;
    actorIdentityId: string;
    correlationId: string;
  }) {
    const current = this.get(input.planId);
    const needsApproval = current.tasks.some(
      (task) => task.requiresHumanApproval
    );

    if (needsApproval && !current.approvedByIdentityId) {
      const waiting: BrainExecutionPlan = {
        ...current,
        status: "waiting-human-approval",
        updatedAt: new Date().toISOString()
      };

      this.plans.set(waiting.id, waiting);
      return waiting;
    }

    const running: BrainExecutionPlan = {
      ...current,
      status: "running",
      tasks: current.tasks.map((task) => ({ ...task })),
      updatedAt: new Date().toISOString()
    };

    this.plans.set(running.id, running);

    for (const task of running.tasks) {
      const dependenciesCompleted =
        task.dependencies.every(
          (dependencyId) =>
            running.tasks.some(
              (candidate) =>
                candidate.id === dependencyId &&
                candidate.status === "completed"
            )
        );

      if (!dependenciesCompleted) {
        task.status = "skipped";
        task.error = "Dependencies are not completed.";
        continue;
      }

      task.status = "running";
      task.startedAt = new Date().toISOString();

      task.status = "completed";
      task.result = {
        executed: true,
        capabilityIds: task.requiredCapabilities
      };
      task.completedAt = new Date().toISOString();
    }

    const failed = running.tasks.some(
      (task) =>
        task.status === "failed" ||
        task.status === "skipped"
    );

    const completedTasks = running.tasks.filter(
      (task) => task.status === "completed"
    ).length;

    const finalPlan: BrainExecutionPlan = {
      ...running,
      status: failed ? "failed" : "completed",
      progress:
        running.tasks.length === 0
          ? 100
          : Number(
              (
                completedTasks /
                running.tasks.length *
                100
              ).toFixed(2)
            ),
      updatedAt: new Date().toISOString(),
      completedAt: new Date().toISOString()
    };

    this.plans.set(finalPlan.id, finalPlan);

    return finalPlan;
  }

  summary() {
    const plans = this.list();

    return {
      total: plans.length,
      ready: plans.filter((x) => x.status === "ready").length,
      running: plans.filter((x) => x.status === "running").length,
      waitingHumanApproval:
        plans.filter((x) => x.status === "waiting-human-approval").length,
      completed: plans.filter((x) => x.status === "completed").length,
      failed: plans.filter((x) => x.status === "failed").length
    };
  }
}
