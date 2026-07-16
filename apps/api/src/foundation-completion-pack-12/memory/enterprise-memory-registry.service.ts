import { createHash } from "crypto";
import {
  Injectable,
  NotFoundException
} from "@nestjs/common";
import {
  EnterpriseMemoryRecord,
  EnterpriseMemoryStatus,
  EnterpriseMemoryType
} from "../foundation-pack-12.types";
import { MemoryAuditService } from "../observability/memory-audit.service";

@Injectable()
export class EnterpriseMemoryRegistryService {
  private readonly memories =
    new Map<string, EnterpriseMemoryRecord>();

  constructor(
    private readonly audit: MemoryAuditService
  ) {}

  list() {
    return Array.from(this.memories.values());
  }

  get(id: string) {
    const memory = this.memories.get(id);

    if (!memory) {
      throw new NotFoundException(
        `Enterprise memory not found: ${id}`
      );
    }

    return memory;
  }

  create(input: {
    type: EnterpriseMemoryType;
    title: string;
    description: string;
    subjectId: string;
    subjectType: string;
    correlationId: string;
    sourceIdentityId: string;
    ownerIdentityId: string;
    sensitivity:
      | "public"
      | "internal"
      | "confidential"
      | "restricted";
    content: Record<string, unknown>;
    summary: string;
    tags?: string[];
    parentMemoryId?: string;
    retentionPolicyId?: string;
    expiresAt?: string;
  }) {
    if (input.parentMemoryId) {
      this.get(input.parentMemoryId);
    }

    const now = new Date().toISOString();

    const draft: Omit<EnterpriseMemoryRecord, "checksum"> = {
      id: `enterprise-memory:${Date.now()}:${
        this.memories.size + 1
      }`,
      type: input.type,
      title: input.title,
      description: input.description,
      subjectId: input.subjectId,
      subjectType: input.subjectType,
      correlationId: input.correlationId,
      sourceIdentityId: input.sourceIdentityId,
      ownerIdentityId: input.ownerIdentityId,
      status: "active",
      sensitivity: input.sensitivity,
      content: input.content,
      summary: input.summary,
      tags: Array.from(new Set(input.tags ?? [])),
      version: 1,
      parentMemoryId: input.parentMemoryId,
      retentionPolicyId: input.retentionPolicyId,
      createdAt: now,
      updatedAt: now,
      expiresAt: input.expiresAt
    };

    const memory: EnterpriseMemoryRecord = {
      ...draft,
      checksum: this.checksum(draft)
    };

    this.memories.set(memory.id, memory);

    this.audit.record({
      correlationId: memory.correlationId,
      category: "memory",
      action: "memory-created",
      subjectId: memory.id,
      actorIdentityId: memory.sourceIdentityId,
      outcome: "success",
      metadata: {
        type: memory.type,
        subjectId: memory.subjectId,
        version: memory.version
      }
    });

    return memory;
  }

  update(
    id: string,
    patch: {
      title?: string;
      description?: string;
      content?: Record<string, unknown>;
      summary?: string;
      tags?: string[];
      sensitivity?:
        | "public"
        | "internal"
        | "confidential"
        | "restricted";
      retentionPolicyId?: string;
      expiresAt?: string;
    },
    context: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    const current = this.get(id);

    const draft: Omit<EnterpriseMemoryRecord, "checksum"> = {
      ...current,
      ...patch,
      tags:
        patch.tags === undefined
          ? current.tags
          : Array.from(new Set(patch.tags)),
      version: current.version + 1,
      updatedAt: new Date().toISOString()
    };

    const updated: EnterpriseMemoryRecord = {
      ...draft,
      checksum: this.checksum(draft)
    };

    this.memories.set(id, updated);

    this.audit.record({
      correlationId: context.correlationId,
      category: "memory",
      action: "memory-updated",
      subjectId: id,
      actorIdentityId: context.actorIdentityId,
      outcome: "success",
      metadata: {
        previousVersion: current.version,
        version: updated.version
      }
    });

    return updated;
  }

  updateStatus(
    id: string,
    status: EnterpriseMemoryStatus,
    input: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    const current = this.get(id);

    const draft: Omit<EnterpriseMemoryRecord, "checksum"> = {
      ...current,
      status,
      archivedAt:
        status === "archived"
          ? new Date().toISOString()
          : current.archivedAt,
      updatedAt: new Date().toISOString()
    };

    const updated: EnterpriseMemoryRecord = {
      ...draft,
      checksum: this.checksum(draft)
    };

    this.memories.set(id, updated);

    this.audit.record({
      correlationId: input.correlationId,
      category: "memory",
      action: `memory-status:${status}`,
      subjectId: id,
      actorIdentityId: input.actorIdentityId,
      outcome: "success",
      metadata: {
        previousStatus: current.status
      }
    });

    return updated;
  }

  byType(type: EnterpriseMemoryType) {
    return this.list().filter(
      (memory) => memory.type === type
    );
  }

  bySubject(subjectId: string) {
    return this.list().filter(
      (memory) => memory.subjectId === subjectId
    );
  }

  byCorrelation(correlationId: string) {
    return this.list().filter(
      (memory) => memory.correlationId === correlationId
    );
  }

  summary() {
    const memories = this.list();

    return {
      total: memories.length,
      active: memories.filter(
        (memory) => memory.status === "active"
      ).length,
      archived: memories.filter(
        (memory) => memory.status === "archived"
      ).length,
      expired: memories.filter(
        (memory) => memory.status === "expired"
      ).length,
      types: {
        operational: memories.filter(
          (memory) => memory.type === "operational"
        ).length,
        architectural: memories.filter(
          (memory) => memory.type === "architectural"
        ).length,
        decision: memories.filter(
          (memory) => memory.type === "decision"
        ).length,
        knowledge: memories.filter(
          (memory) => memory.type === "knowledge"
        ).length,
        incident: memories.filter(
          (memory) => memory.type === "incident"
        ).length
      }
    };
  }

  private checksum(value: unknown) {
    return createHash("sha256")
      .update(JSON.stringify(value))
      .digest("hex");
  }
}
