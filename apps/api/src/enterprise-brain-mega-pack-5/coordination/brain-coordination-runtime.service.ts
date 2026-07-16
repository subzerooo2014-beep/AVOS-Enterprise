import {
  ConflictException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import {
  BrainCoordinationPlan,
  BrainCoordinationTask
} from "../enterprise-brain-mega-pack-5.types";
import { BrainAgentRegistryService } from "../agents/brain-agent-registry.service";
import { BrainDelegationService } from "../delegation/brain-delegation.service";
import { BrainMultiAgentAuditService } from "../observability/brain-multi-agent-audit.service";

@Injectable()
export class BrainCoordinationRuntimeService {
  private readonly plans = new Map<string, BrainCoordinationPlan>();

  constructor(
    private readonly agents: BrainAgentRegistryService,
    private readonly delegations: BrainDelegationService,
    private readonly audit: BrainMultiAgentAuditService
  ) {}

  list() {
    return Array.from(this.plans.values());
  }

  get(id: string) {
    const plan = this.plans.get(id);

    if (!plan) {
      throw new NotFoundException(`Brain coordination plan not found: ${id}`);
    }

    return plan;
  }

  create(input: {
    name: string;
    objective: string;
    tasks: Array<Omit<
      BrainCoordinationTask,
      "assignedAgentId" | "status" | "result" | "error" | "startedAt" | "completedAt"
    >>;
    sharedContextIds?: string[];
    supervisorAgentId: string;
    createdByIdentityId: string;
    correlationId: string;
    traceId?: string;
  }) {
    this.agents.get(input.supervisorAgentId);

    const ids = new Set(input.tasks.map((task) => task.id));

    if (ids.size !== input.tasks.length) {
      throw new ConflictException(
        "Brain coordination plan contains duplicate task ids."
      );
    }

    for (const task of input.tasks) {
      for (const dependencyId of task.dependencies) {
        if (!ids.has(dependencyId)) {
          throw new ConflictException(
            `Coordination dependency not found: ${dependencyId}`
          );
        }
      }
    }

    const now = new Date().toISOString();

    const plan: BrainCoordinationPlan = {
      id: `brain-coordination:${Date.now()}:${this.plans.size + 1}`,
      name: input.name,
      objective: input.objective,
      tasks: input.tasks.map((task) => ({
        ...task,
        requiredCapabilities:
          Array.from(new Set(task.requiredCapabilities)),
        dependencies:
          Array.from(new Set(task.dependencies)),
        status: "pending" as const
      })),
      participatingAgentIds: [input.supervisorAgentId],
      sharedContextIds:
        Array.from(new Set(input.sharedContextIds ?? [])),
      status: "ready",
      progress: 0,
      supervisorAgentId: input.supervisorAgentId,
      correlationId: input.correlationId,
      traceId: input.traceId ?? `brain-coordination-trace:${Date.now()}`,
      createdByIdentityId: input.createdByIdentityId,
      createdAt: now,
      updatedAt: now
    };

    this.plans.set(plan.id, plan);

    this.audit.record({
      correlationId: input.correlationId,
      category: "coordination",
      action: "brain-coordination-plan-created",
      subjectId: plan.id,
      actorIdentityId: input.createdByIdentityId,
      outcome: "success",
      metadata: {
        tasks: plan.tasks.length,
        supervisorAgentId: plan.supervisorAgentId
      }
    });

    return plan;
  }

  assign(input: {
    planId: string;
    taskId: string;
    actorIdentityId: string;
    correlationId: string;
  }) {
    const current = this.get(input.planId);
    const task = current.tasks.find((item) => item.id === input.taskId);

    if (!task) {
      throw new NotFoundException(
        `Brain coordination task not found: ${input.taskId}`
      );
    }

    const candidates = this.agents.findCandidates({
      taskType: task.taskType,
      requiredCapabilities: task.requiredCapabilities
    });

    const selected = candidates[0];

    if (!selected) {
      throw new ConflictException(
        `No agent available for task: ${task.id}`
      );
    }

    task.assignedAgentId = selected.agent.id;
    task.status = "assigned";

    const participatingAgentIds =
      Array.from(
        new Set([
          ...current.participatingAgentIds,
          selected.agent.id
        ])
      );

    const updated: BrainCoordinationPlan = {
      ...current,
      tasks: current.tasks.map((item) => ({ ...item })),
      participatingAgentIds,
      updatedAt: new Date().toISOString()
    };

    this.plans.set(updated.id, updated);

    return {
      plan: updated,
      task,
      selectedAgent: selected
    };
  }

  approve(input: {
    planId: string;
    approvedByIdentityId: string;
  }) {
    const current = this.get(input.planId);

    const updated: BrainCoordinationPlan = {
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

    const needsApproval =
      current.tasks.some((task) => task.requiresHumanApproval);

    if (needsApproval && !current.approvedByIdentityId) {
      const waiting: BrainCoordinationPlan = {
        ...current,
        status: "waiting-human-approval",
        updatedAt: new Date().toISOString()
      };

      this.plans.set(waiting.id, waiting);
      return waiting;
    }

    const running: BrainCoordinationPlan = {
      ...current,
      status: "running",
      tasks: current.tasks.map((task) => ({ ...task })),
      updatedAt: new Date().toISOString()
    };

    for (const task of running.tasks) {
      const dependenciesComplete =
        task.dependencies.every(
          (dependencyId) =>
            running.tasks.some(
              (candidate) =>
                candidate.id === dependencyId &&
                candidate.status === "completed"
            )
        );

      if (!dependenciesComplete) {
        task.status = "skipped";
        task.error = "Task dependencies are incomplete.";
        continue;
      }

      if (!task.assignedAgentId) {
        const candidates = this.agents.findCandidates({
          taskType: task.taskType,
          requiredCapabilities: task.requiredCapabilities
        });

        if (!candidates[0]) {
          task.status = "failed";
          task.error = "No capable agent available.";
          continue;
        }

        task.assignedAgentId = candidates[0].agent.id;
      }

      this.agents.incrementTasks(task.assignedAgentId, 1);

      task.status = "running";
      task.startedAt = new Date().toISOString();

      task.result = {
        executedByAgentId: task.assignedAgentId,
        objective: task.description
      };
      task.status = "completed";
      task.completedAt = new Date().toISOString();

      this.agents.incrementTasks(task.assignedAgentId, -1);
    }

    const failed = running.tasks.some(
      (task) =>
        task.status === "failed" ||
        task.status === "skipped"
    );

    const completed = running.tasks.filter(
      (task) => task.status === "completed"
    ).length;

    const finalPlan: BrainCoordinationPlan = {
      ...running,
      status: failed ? "failed" : "completed",
      progress:
        running.tasks.length === 0
          ? 100
          : Number(
              (
                completed /
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
    const items = this.list();

    return {
      total: items.length,
      ready: items.filter((x) => x.status === "ready").length,
      running: items.filter((x) => x.status === "running").length,
      waitingHumanApproval:
        items.filter((x) => x.status === "waiting-human-approval").length,
      completed: items.filter((x) => x.status === "completed").length,
      failed: items.filter((x) => x.status === "failed").length
    };
  }
}
