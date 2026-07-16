import {
  ConflictException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { BrainSharedContext } from "../enterprise-brain-mega-pack-5.types";
import { BrainAgentRegistryService } from "../agents/brain-agent-registry.service";
import { BrainMultiAgentAuditService } from "../observability/brain-multi-agent-audit.service";

@Injectable()
export class BrainSharedContextService {
  private readonly entries = new Map<string, BrainSharedContext>();

  constructor(
    private readonly agents: BrainAgentRegistryService,
    private readonly audit: BrainMultiAgentAuditService
  ) {}

  list() {
    return Array.from(this.entries.values());
  }

  get(id: string) {
    const entry = this.entries.get(id);

    if (!entry) {
      throw new NotFoundException(`Brain shared context not found: ${id}`);
    }

    return entry;
  }

  set(input: {
    scopeId: string;
    key: string;
    value: unknown;
    visibleToAgentIds: string[];
    writableByAgentIds: string[];
    sensitive: boolean;
    sourceAgentId?: string;
    sourceIdentityId?: string;
    metadata?: Record<string, unknown>;
    actorIdentityId: string;
    correlationId: string;
  }) {
    for (const id of input.visibleToAgentIds) this.agents.get(id);
    for (const id of input.writableByAgentIds) this.agents.get(id);

    const existing = this.list().find(
      (entry) =>
        entry.scopeId === input.scopeId &&
        entry.key === input.key
    );

    const now = new Date().toISOString();

    const entry: BrainSharedContext = {
      id:
        existing?.id ??
        `brain-shared-context:${Date.now()}:${this.entries.size + 1}`,
      scopeId: input.scopeId,
      key: input.key,
      value: input.value,
      visibleToAgentIds:
        Array.from(new Set(input.visibleToAgentIds)),
      writableByAgentIds:
        Array.from(new Set(input.writableByAgentIds)),
      sensitive: input.sensitive,
      version: (existing?.version ?? 0) + 1,
      sourceAgentId: input.sourceAgentId,
      sourceIdentityId: input.sourceIdentityId,
      metadata: input.metadata ?? {},
      createdAt: existing?.createdAt ?? now,
      updatedAt: now
    };

    this.entries.set(entry.id, entry);

    this.audit.record({
      correlationId: input.correlationId,
      category: "context",
      action: existing
        ? "brain-shared-context-updated"
        : "brain-shared-context-created",
      subjectId: entry.id,
      actorIdentityId: input.actorIdentityId,
      outcome: "success",
      metadata: {
        scopeId: entry.scopeId,
        key: entry.key,
        version: entry.version
      }
    });

    return entry;
  }

  read(input: {
    contextId: string;
    agentId: string;
  }) {
    const entry = this.get(input.contextId);

    if (!entry.visibleToAgentIds.includes(input.agentId)) {
      throw new ConflictException(
        `Agent cannot read shared context: ${input.agentId}`
      );
    }

    return entry;
  }

  write(input: {
    contextId: string;
    agentId: string;
    value: unknown;
  }) {
    const current = this.get(input.contextId);

    if (!current.writableByAgentIds.includes(input.agentId)) {
      throw new ConflictException(
        `Agent cannot write shared context: ${input.agentId}`
      );
    }

    const updated: BrainSharedContext = {
      ...current,
      value: input.value,
      version: current.version + 1,
      sourceAgentId: input.agentId,
      updatedAt: new Date().toISOString()
    };

    this.entries.set(updated.id, updated);
    return updated;
  }

  summary() {
    const entries = this.list();

    return {
      total: entries.length,
      sensitive: entries.filter((x) => x.sensitive).length,
      scopes: new Set(entries.map((x) => x.scopeId)).size,
      versions:
        entries.reduce((sum, item) => sum + item.version, 0)
    };
  }
}
