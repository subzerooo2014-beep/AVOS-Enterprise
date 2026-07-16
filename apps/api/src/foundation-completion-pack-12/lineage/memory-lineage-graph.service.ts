import {
  BadRequestException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import {
  MemoryRelation,
  MemoryRelationType
} from "../foundation-pack-12.types";
import { EnterpriseMemoryRegistryService } from "../memory/enterprise-memory-registry.service";
import { MemoryAuditService } from "../observability/memory-audit.service";

@Injectable()
export class MemoryLineageGraphService {
  private readonly relations =
    new Map<string, MemoryRelation>();

  constructor(
    private readonly memories: EnterpriseMemoryRegistryService,
    private readonly audit: MemoryAuditService
  ) {}

  list() {
    return Array.from(this.relations.values());
  }

  get(id: string) {
    const relation = this.relations.get(id);

    if (!relation) {
      throw new NotFoundException(
        `Memory relation not found: ${id}`
      );
    }

    return relation;
  }

  link(input: {
    fromMemoryId: string;
    toMemoryId: string;
    relation: MemoryRelationType;
    strength?: number;
    reason: string;
    metadata?: Record<string, unknown>;
    correlationId: string;
    actorIdentityId: string;
  }) {
    if (input.fromMemoryId === input.toMemoryId) {
      throw new BadRequestException(
        "A memory cannot relate to itself."
      );
    }

    this.memories.get(input.fromMemoryId);
    this.memories.get(input.toMemoryId);

    const duplicate = this.list().find(
      (relation) =>
        relation.fromMemoryId === input.fromMemoryId &&
        relation.toMemoryId === input.toMemoryId &&
        relation.relation === input.relation
    );

    if (duplicate) {
      return duplicate;
    }

    const relation: MemoryRelation = {
      id: `memory-relation:${Date.now()}:${
        this.relations.size + 1
      }`,
      fromMemoryId: input.fromMemoryId,
      toMemoryId: input.toMemoryId,
      relation: input.relation,
      strength: Math.max(
        0,
        Math.min(100, input.strength ?? 100)
      ),
      reason: input.reason,
      metadata: input.metadata ?? {},
      createdAt: new Date().toISOString()
    };

    this.relations.set(relation.id, relation);

    this.audit.record({
      correlationId: input.correlationId,
      category: "relation",
      action: "memory-relation-created",
      subjectId: relation.id,
      actorIdentityId: input.actorIdentityId,
      outcome: "success",
      metadata: {
        fromMemoryId: relation.fromMemoryId,
        toMemoryId: relation.toMemoryId,
        relation: relation.relation
      }
    });

    return relation;
  }

  lineage(memoryId: string) {
    this.memories.get(memoryId);

    const visited = new Set<string>();
    const queue = [memoryId];
    const memories = [];
    const relations: MemoryRelation[] = [];

    while (queue.length > 0) {
      const currentId = queue.shift();

      if (!currentId || visited.has(currentId)) {
        continue;
      }

      visited.add(currentId);
      memories.push(this.memories.get(currentId));

      const related = this.list().filter(
        (relation) =>
          relation.fromMemoryId === currentId ||
          relation.toMemoryId === currentId
      );

      for (const relation of related) {
        if (
          !relations.some(
            (candidate) => candidate.id === relation.id
          )
        ) {
          relations.push(relation);
        }

        const otherId =
          relation.fromMemoryId === currentId
            ? relation.toMemoryId
            : relation.fromMemoryId;

        if (!visited.has(otherId)) {
          queue.push(otherId);
        }
      }
    }

    return {
      rootMemoryId: memoryId,
      memories,
      relations
    };
  }

  incoming(memoryId: string) {
    return this.list().filter(
      (relation) => relation.toMemoryId === memoryId
    );
  }

  outgoing(memoryId: string) {
    return this.list().filter(
      (relation) => relation.fromMemoryId === memoryId
    );
  }

  summary() {
    return {
      total: this.relations.size,
      derivedFrom: this.list().filter(
        (relation) => relation.relation === "derived-from"
      ).length,
      supersedes: this.list().filter(
        (relation) => relation.relation === "supersedes"
      ).length,
      references: this.list().filter(
        (relation) => relation.relation === "references"
      ).length
    };
  }
}
