import { createHash } from "crypto";
import { Injectable } from "@nestjs/common";
import {
  KnowledgeContinuitySnapshot
} from "../foundation-pack-12.types";
import { EnterpriseMemoryRegistryService } from "../memory/enterprise-memory-registry.service";
import { ContextAssemblyEngineService } from "../contexts/context-assembly-engine.service";
import { MemoryLineageGraphService } from "../lineage/memory-lineage-graph.service";
import { MemoryAuditService } from "../observability/memory-audit.service";

@Injectable()
export class KnowledgeContinuityService {
  private readonly snapshots =
    new Map<string, KnowledgeContinuitySnapshot>();

  constructor(
    private readonly memories: EnterpriseMemoryRegistryService,
    private readonly contexts: ContextAssemblyEngineService,
    private readonly lineage: MemoryLineageGraphService,
    private readonly audit: MemoryAuditService
  ) {}

  list() {
    return Array.from(this.snapshots.values());
  }

  createSnapshot(input: {
    name: string;
    memoryIds?: string[];
    contextIds?: string[];
    createdByIdentityId: string;
    correlationId: string;
  }) {
    const memoryIds =
      input.memoryIds ??
      this.memories
        .list()
        .filter(
          (memory) =>
            memory.status === "active" ||
            memory.status === "archived"
        )
        .map((memory) => memory.id);

    const contextIds =
      input.contextIds ??
      this.contexts.list().map(
        (context) => context.id
      );

    for (const id of memoryIds) {
      this.memories.get(id);
    }

    for (const id of contextIds) {
      this.contexts.get(id);
    }

    const relationIds = this.lineage
      .list()
      .filter(
        (relation) =>
          memoryIds.includes(relation.fromMemoryId) &&
          memoryIds.includes(relation.toMemoryId)
      )
      .map((relation) => relation.id);

    const checksum = createHash("sha256")
      .update(
        JSON.stringify({
          memoryIds,
          contextIds,
          relationIds
        })
      )
      .digest("hex");

    const snapshot: KnowledgeContinuitySnapshot = {
      id: `knowledge-continuity:${Date.now()}:${
        this.snapshots.size + 1
      }`,
      name: input.name,
      memoryIds,
      contextIds,
      relationIds,
      checksum,
      createdByIdentityId:
        input.createdByIdentityId,
      createdAt: new Date().toISOString()
    };

    this.snapshots.set(snapshot.id, snapshot);

    this.audit.record({
      correlationId: input.correlationId,
      category: "continuity",
      action: "continuity-snapshot-created",
      subjectId: snapshot.id,
      actorIdentityId:
        input.createdByIdentityId,
      outcome: "success",
      metadata: {
        memories: memoryIds.length,
        contexts: contextIds.length,
        relations: relationIds.length
      }
    });

    return snapshot;
  }

  summary() {
    const snapshots = this.list();

    return {
      total: snapshots.length,
      latestMemoryCoverage:
        snapshots.length === 0
          ? 0
          : snapshots[snapshots.length - 1]
              ?.memoryIds.length ?? 0
    };
  }
}
