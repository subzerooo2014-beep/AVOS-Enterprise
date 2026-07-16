import {
  ConflictException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { BrainAgentDescriptor } from "../enterprise-brain-mega-pack-5.types";
import { BrainMultiAgentAuditService } from "../observability/brain-multi-agent-audit.service";

@Injectable()
export class BrainAgentRegistryService {
  private readonly agents = new Map<string, BrainAgentDescriptor>();

  constructor(
    private readonly audit: BrainMultiAgentAuditService
  ) {
    this.seed();
  }

  list() {
    return Array.from(this.agents.values());
  }

  get(id: string) {
    const agent = this.agents.get(id);

    if (!agent) {
      throw new NotFoundException(`Brain agent not found: ${id}`);
    }

    return agent;
  }

  register(
    input: Omit<BrainAgentDescriptor, "createdAt" | "updatedAt">,
    context: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    if (this.agents.has(input.id)) {
      throw new ConflictException(`Brain agent already exists: ${input.id}`);
    }

    const now = new Date().toISOString();

    const agent: BrainAgentDescriptor = {
      ...input,
      capabilities: Array.from(new Set(input.capabilities)),
      permissions: Array.from(new Set(input.permissions)),
      supportedTaskTypes: Array.from(new Set(input.supportedTaskTypes)),
      requiresHumanApprovalFor:
        Array.from(new Set(input.requiresHumanApprovalFor)),
      reliabilityScore: this.clamp(input.reliabilityScore),
      qualityScore: this.clamp(input.qualityScore),
      costScore: this.clamp(input.costScore),
      latencyScore: this.clamp(input.latencyScore),
      maxConcurrentTasks: Math.max(1, input.maxConcurrentTasks),
      currentTasks: Math.max(0, input.currentTasks),
      createdAt: now,
      updatedAt: now
    };

    this.agents.set(agent.id, agent);

    this.audit.record({
      correlationId: context.correlationId,
      category: "agent",
      action: "brain-agent-registered",
      subjectId: agent.id,
      actorIdentityId: context.actorIdentityId,
      outcome: "success",
      metadata: {
        trustLevel: agent.trustLevel,
        capabilities: agent.capabilities.length
      }
    });

    return agent;
  }

  updateStatus(
    id: string,
    status: BrainAgentDescriptor["status"]
  ) {
    const current = this.get(id);

    const updated: BrainAgentDescriptor = {
      ...current,
      status,
      updatedAt: new Date().toISOString()
    };

    this.agents.set(updated.id, updated);
    return updated;
  }

  incrementTasks(id: string, delta: number) {
    const current = this.get(id);

    const updated: BrainAgentDescriptor = {
      ...current,
      currentTasks: Math.max(
        0,
        Math.min(
          current.maxConcurrentTasks,
          current.currentTasks + delta
        )
      ),
      status:
        current.currentTasks + delta >= current.maxConcurrentTasks
          ? "busy"
          : "ready",
      updatedAt: new Date().toISOString()
    };

    this.agents.set(updated.id, updated);
    return updated;
  }

  findCandidates(input: {
    taskType: string;
    requiredCapabilities: string[];
    requiredPermissions?: string[];
  }) {
    return this.list()
      .filter(
        (agent) =>
          (
            agent.status === "ready" ||
            agent.status === "registered"
          ) &&
          agent.currentTasks < agent.maxConcurrentTasks &&
          agent.supportedTaskTypes.includes(input.taskType) &&
          input.requiredCapabilities.every(
            (capability) =>
              agent.capabilities.includes(capability)
          ) &&
          (input.requiredPermissions ?? []).every(
            (permission) =>
              agent.permissions.includes(permission)
          )
      )
      .map((agent) => ({
        agent,
        score: Number(
          (
            agent.reliabilityScore * 0.35 +
            agent.qualityScore * 0.35 +
            (100 - agent.costScore) * 0.15 +
            (100 - agent.latencyScore) * 0.15
          ).toFixed(2)
        )
      }))
      .sort((left, right) => right.score - left.score);
  }

  summary() {
    const agents = this.list();

    return {
      total: agents.length,
      ready: agents.filter((x) => x.status === "ready").length,
      busy: agents.filter((x) => x.status === "busy").length,
      degraded: agents.filter((x) => x.status === "degraded").length,
      offline: agents.filter((x) => x.status === "offline").length,
      system: agents.filter((x) => x.trustLevel === "system").length
    };
  }

  private clamp(value: number) {
    return Math.max(0, Math.min(100, value));
  }

  private seed() {
    const now = new Date().toISOString();

    const agents: BrainAgentDescriptor[] = [
      {
        id: "brain-agent:supervisor",
        name: "AVOS Supervisor Brain",
        description: "Supervises enterprise multi-agent execution.",
        version: "1.0.0",
        status: "ready",
        trustLevel: "system",
        capabilities: [
          "agent.supervision",
          "agent.assignment",
          "agent.escalation",
          "agent.recovery"
        ],
        permissions: [
          "brain.agent.read",
          "brain.agent.assign",
          "brain.agent.pause",
          "brain.agent.escalate"
        ],
        supportedTaskTypes: [
          "supervision",
          "coordination",
          "recovery"
        ],
        maxConcurrentTasks: 100,
        currentTasks: 0,
        reliabilityScore: 100,
        qualityScore: 100,
        costScore: 10,
        latencyScore: 10,
        requiresHumanApprovalFor: [
          "critical-escalation",
          "agent-block"
        ],
        metadata: { seeded: true },
        createdAt: now,
        updatedAt: now
      },
      {
        id: "brain-agent:analyst",
        name: "AVOS Analyst Agent",
        description: "Performs enterprise analysis.",
        version: "1.0.0",
        status: "ready",
        trustLevel: "trusted",
        capabilities: [
          "analysis",
          "risk.analysis",
          "opportunity.analysis"
        ],
        permissions: [
          "brain.context.read",
          "brain.knowledge.read"
        ],
        supportedTaskTypes: [
          "analysis",
          "risk",
          "opportunity"
        ],
        maxConcurrentTasks: 5,
        currentTasks: 0,
        reliabilityScore: 92,
        qualityScore: 94,
        costScore: 30,
        latencyScore: 25,
        requiresHumanApprovalFor: [],
        metadata: { seeded: true },
        createdAt: now,
        updatedAt: now
      },
      {
        id: "brain-agent:planner",
        name: "AVOS Planner Agent",
        description: "Builds governed plans and decomposes tasks.",
        version: "1.0.0",
        status: "ready",
        trustLevel: "trusted",
        capabilities: [
          "planning",
          "task.decomposition",
          "dependency.planning"
        ],
        permissions: [
          "brain.context.read",
          "brain.plan.create"
        ],
        supportedTaskTypes: [
          "planning",
          "decomposition",
          "dependency"
        ],
        maxConcurrentTasks: 5,
        currentTasks: 0,
        reliabilityScore: 93,
        qualityScore: 95,
        costScore: 35,
        latencyScore: 30,
        requiresHumanApprovalFor: [
          "critical-plan"
        ],
        metadata: { seeded: true },
        createdAt: now,
        updatedAt: now
      }
    ];

    for (const agent of agents) {
      this.agents.set(agent.id, agent);
    }
  }
}
