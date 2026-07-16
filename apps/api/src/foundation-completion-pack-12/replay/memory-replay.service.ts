import { Injectable } from "@nestjs/common";
import {
  MemoryReplayResult
} from "../foundation-pack-12.types";
import { EnterpriseMemoryRegistryService } from "../memory/enterprise-memory-registry.service";
import { MemoryLineageGraphService } from "../lineage/memory-lineage-graph.service";
import { MemoryAuditService } from "../observability/memory-audit.service";

@Injectable()
export class MemoryReplayService {
  private readonly replays =
    new Map<string, MemoryReplayResult>();

  constructor(
    private readonly memories: EnterpriseMemoryRegistryService,
    private readonly lineage: MemoryLineageGraphService,
    private readonly audit: MemoryAuditService
  ) {}

  list() {
    return Array.from(this.replays.values());
  }

  replay(input: {
    sourceMemoryId: string;
    replayedByIdentityId: string;
    correlationId: string;
    overrideContent?: Record<string, unknown>;
  }) {
    const source = this.memories.get(
      input.sourceMemoryId
    );

    const replay = this.memories.create({
      type: source.type,
      title: `Replay: ${source.title}`,
      description: source.description,
      subjectId: source.subjectId,
      subjectType: source.subjectType,
      correlationId: input.correlationId,
      sourceIdentityId: input.replayedByIdentityId,
      ownerIdentityId: source.ownerIdentityId,
      sensitivity: source.sensitivity,
      content: {
        ...source.content,
        ...(input.overrideContent ?? {})
      },
      summary: source.summary,
      tags: [
        ...source.tags,
        "memory-replay"
      ],
      parentMemoryId: source.id,
      retentionPolicyId:
        source.retentionPolicyId,
      expiresAt: source.expiresAt
    });

    const equivalentContent =
      JSON.stringify(source.content) ===
      JSON.stringify(replay.content);

    const equivalentContext =
      source.subjectId === replay.subjectId &&
      source.subjectType === replay.subjectType;

    const differences: string[] = [];

    if (!equivalentContent) {
      differences.push(
        "Replay content differs from source memory."
      );
    }

    if (!equivalentContext) {
      differences.push(
        "Replay context differs from source memory."
      );
    }

    const result: MemoryReplayResult = {
      id: `memory-replay:${Date.now()}:${
        this.replays.size + 1
      }`,
      sourceMemoryId: source.id,
      replayMemoryId: replay.id,
      equivalentContent,
      equivalentContext,
      differences,
      replayedByIdentityId:
        input.replayedByIdentityId,
      replayedAt: new Date().toISOString()
    };

    this.replays.set(result.id, result);

    this.lineage.link({
      fromMemoryId: replay.id,
      toMemoryId: source.id,
      relation: "replayed-from",
      reason:
        "Memory replay generated for continuity and comparison.",
      correlationId: input.correlationId,
      actorIdentityId:
        input.replayedByIdentityId
    });

    this.audit.record({
      correlationId: input.correlationId,
      category: "replay",
      action: "memory-replayed",
      subjectId: result.id,
      actorIdentityId:
        input.replayedByIdentityId,
      outcome: "success",
      metadata: {
        sourceMemoryId: source.id,
        replayMemoryId: replay.id,
        equivalentContent
      }
    });

    return result;
  }

  summary() {
    const replays = this.list();

    return {
      total: replays.length,
      equivalentContent: replays.filter(
        (replay) => replay.equivalentContent
      ).length,
      differencesDetected: replays.filter(
        (replay) => replay.differences.length > 0
      ).length
    };
  }
}
