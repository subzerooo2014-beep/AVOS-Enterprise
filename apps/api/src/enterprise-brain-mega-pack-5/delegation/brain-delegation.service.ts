import {
  ConflictException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { BrainDelegation } from "../enterprise-brain-mega-pack-5.types";
import { BrainAgentRegistryService } from "../agents/brain-agent-registry.service";
import { BrainSharedContextService } from "../context/brain-shared-context.service";
import { BrainMultiAgentAuditService } from "../observability/brain-multi-agent-audit.service";

@Injectable()
export class BrainDelegationService {
  private readonly records = new Map<string, BrainDelegation>();

  constructor(
    private readonly agents: BrainAgentRegistryService,
    private readonly context: BrainSharedContextService,
    private readonly audit: BrainMultiAgentAuditService
  ) {}

  list() {
    return Array.from(this.records.values());
  }

  get(id: string) {
    const record = this.records.get(id);

    if (!record) {
      throw new NotFoundException(`Brain delegation not found: ${id}`);
    }

    return record;
  }

  create(input: {
    coordinationId: string;
    taskId: string;
    fromAgentId: string;
    toAgentId: string;
    reason: string;
    requiredCapabilities: string[];
    contextIds: string[];
    priority: BrainDelegation["priority"];
    actorIdentityId: string;
    correlationId: string;
  }) {
    const fromAgent = this.agents.get(input.fromAgentId);
    const toAgent = this.agents.get(input.toAgentId);

    if (
      !input.requiredCapabilities.every(
        (capability) =>
          toAgent.capabilities.includes(capability)
      )
    ) {
      throw new ConflictException(
        `Delegated agent lacks required capabilities: ${toAgent.id}`
      );
    }

    for (const contextId of input.contextIds) {
      this.context.read({
        contextId,
        agentId: toAgent.id
      });
    }

    const now = new Date().toISOString();

    const record: BrainDelegation = {
      id: `brain-delegation:${Date.now()}:${this.records.size + 1}`,
      coordinationId: input.coordinationId,
      taskId: input.taskId,
      fromAgentId: fromAgent.id,
      toAgentId: toAgent.id,
      reason: input.reason,
      requiredCapabilities:
        Array.from(new Set(input.requiredCapabilities)),
      contextIds:
        Array.from(new Set(input.contextIds)),
      priority: input.priority,
      status: "proposed",
      createdAt: now,
      updatedAt: now
    };

    this.records.set(record.id, record);

    this.audit.record({
      correlationId: input.correlationId,
      category: "delegation",
      action: "brain-delegation-created",
      subjectId: record.id,
      actorIdentityId: input.actorIdentityId,
      outcome: "success",
      metadata: {
        fromAgentId: record.fromAgentId,
        toAgentId: record.toAgentId,
        priority: record.priority
      }
    });

    return record;
  }

  accept(input: {
    delegationId: string;
    agentId: string;
  }) {
    const current = this.get(input.delegationId);

    if (current.toAgentId !== input.agentId) {
      throw new ConflictException(
        "Only target agent can accept delegation."
      );
    }

    this.agents.incrementTasks(input.agentId, 1);

    const updated: BrainDelegation = {
      ...current,
      status: "accepted",
      updatedAt: new Date().toISOString()
    };

    this.records.set(updated.id, updated);
    return updated;
  }

  complete(input: {
    delegationId: string;
    agentId: string;
    result: unknown;
  }) {
    const current = this.get(input.delegationId);

    if (current.toAgentId !== input.agentId) {
      throw new ConflictException(
        "Only target agent can complete delegation."
      );
    }

    this.agents.incrementTasks(input.agentId, -1);

    const updated: BrainDelegation = {
      ...current,
      status: "completed",
      result: input.result,
      updatedAt: new Date().toISOString(),
      completedAt: new Date().toISOString()
    };

    this.records.set(updated.id, updated);
    return updated;
  }

  fail(input: {
    delegationId: string;
    agentId: string;
    error: string;
  }) {
    const current = this.get(input.delegationId);

    this.agents.incrementTasks(input.agentId, -1);

    const updated: BrainDelegation = {
      ...current,
      status: "failed",
      error: input.error,
      updatedAt: new Date().toISOString(),
      completedAt: new Date().toISOString()
    };

    this.records.set(updated.id, updated);
    return updated;
  }

  summary() {
    const items = this.list();

    return {
      total: items.length,
      accepted: items.filter((x) => x.status === "accepted").length,
      completed: items.filter((x) => x.status === "completed").length,
      failed: items.filter((x) => x.status === "failed").length,
      rejected: items.filter((x) => x.status === "rejected").length
    };
  }
}
