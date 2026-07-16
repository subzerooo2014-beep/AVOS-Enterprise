import {
  ConflictException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { BrainMemoryRecord } from "../enterprise-brain-mega-pack-2.types";
import { BrainKnowledgeGraphService } from "../knowledge/brain-knowledge-graph.service";
import { BrainKnowledgeAuditService } from "../observability/brain-knowledge-audit.service";

@Injectable()
export class BrainMemoryStoreService {
  private readonly memories = new Map<string, BrainMemoryRecord>();

  constructor(
    private readonly graph: BrainKnowledgeGraphService,
    private readonly audit: BrainKnowledgeAuditService
  ) {}

  list() {
    return Array.from(this.memories.values());
  }

  get(id: string) {
    const memory = this.memories.get(id);

    if (!memory) {
      throw new NotFoundException(`Brain memory not found: ${id}`);
    }

    return memory;
  }

  create(
    input: Omit<BrainMemoryRecord, "id" | "createdAt" | "updatedAt" | "status"> & {
      id?: string;
      status?: BrainMemoryRecord["status"];
    },
    context: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    for (const nodeId of input.relatedKnowledgeNodeIds) {
      this.graph.getNode(nodeId);
    }

    const now = new Date().toISOString();

    const memory: BrainMemoryRecord = {
      ...input,
      id:
        input.id ??
        `brain-memory:${Date.now()}:${this.memories.size + 1}`,
      tags: Array.from(new Set(input.tags)),
      relatedKnowledgeNodeIds:
        Array.from(new Set(input.relatedKnowledgeNodeIds)),
      importance: Math.max(0, Math.min(100, input.importance)),
      confidence: Math.max(0, Math.min(100, input.confidence)),
      retentionScore: Math.max(0, Math.min(100, input.retentionScore)),
      status: input.status ?? "active",
      createdAt: now,
      updatedAt: now
    };

    if (this.memories.has(memory.id)) {
      throw new ConflictException(`Brain memory already exists: ${memory.id}`);
    }

    this.memories.set(memory.id, memory);

    this.audit.record({
      correlationId: context.correlationId,
      category: "memory",
      action: "brain-memory-created",
      subjectId: memory.id,
      actorIdentityId: context.actorIdentityId,
      outcome: "success",
      metadata: {
        type: memory.type,
        importance: memory.importance,
        sensitive: memory.sensitive
      }
    });

    return memory;
  }

  update(
    id: string,
    patch: Partial<Omit<BrainMemoryRecord, "id" | "createdAt">>
  ) {
    const current = this.get(id);

    const updated: BrainMemoryRecord = {
      ...current,
      ...patch,
      tags:
        patch.tags === undefined
          ? current.tags
          : Array.from(new Set(patch.tags)),
      relatedKnowledgeNodeIds:
        patch.relatedKnowledgeNodeIds === undefined
          ? current.relatedKnowledgeNodeIds
          : Array.from(new Set(patch.relatedKnowledgeNodeIds)),
      updatedAt: new Date().toISOString()
    };

    this.memories.set(updated.id, updated);
    return updated;
  }

  archive(input: {
    memoryId: string;
    actorIdentityId: string;
    correlationId: string;
  }) {
    const current = this.get(input.memoryId);

    const updated: BrainMemoryRecord = {
      ...current,
      status: "archived",
      archivedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.memories.set(updated.id, updated);
    return updated;
  }

  remove(input: {
    memoryId: string;
    actorIdentityId: string;
    correlationId: string;
    humanApproved: boolean;
  }) {
    const current = this.get(input.memoryId);

    if (
      current.sensitive &&
      !input.humanApproved
    ) {
      throw new ConflictException(
        "Sensitive brain memory deletion requires human approval."
      );
    }

    const updated: BrainMemoryRecord = {
      ...current,
      status: "deleted",
      updatedAt: new Date().toISOString()
    };

    this.memories.set(updated.id, updated);
    return updated;
  }

  summary() {
    const memories = this.list();

    return {
      total: memories.length,
      active: memories.filter((x) => x.status === "active").length,
      archived: memories.filter((x) => x.status === "archived").length,
      sensitive: memories.filter((x) => x.sensitive).length,
      working: memories.filter((x) => x.type === "working").length,
      operational: memories.filter((x) => x.type === "operational").length,
      episodic: memories.filter((x) => x.type === "episodic").length,
      semantic: memories.filter((x) => x.type === "semantic").length,
      longTerm: memories.filter((x) => x.type === "long-term").length
    };
  }
}
