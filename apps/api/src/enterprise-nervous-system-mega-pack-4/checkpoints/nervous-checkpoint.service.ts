import { Injectable } from "@nestjs/common";
import { NervousCheckpoint } from "../enterprise-nervous-system-mega-pack-4.types";
import { NervousOffsetManagerService } from "../offsets/nervous-offset-manager.service";
import { NervousStreamingAuditService } from "../observability/nervous-streaming-audit.service";

@Injectable()
export class NervousCheckpointService {
  private readonly checkpoints =
    new Map<string, NervousCheckpoint>();

  constructor(
    private readonly offsets: NervousOffsetManagerService,
    private readonly audit: NervousStreamingAuditService
  ) {}

  create(input: {
    streamId: string;
    consumerGroupId: string;
    state: Record<string, unknown>;
    correlationId: string;
    createdByIdentityId: string;
  }) {
    const matching = this.offsets.list().filter(
      (item) =>
        item.streamId === input.streamId &&
        item.consumerGroupId === input.consumerGroupId
    );

    const checkpoint: NervousCheckpoint = {
      id: `nervous-checkpoint:${Date.now()}:${this.checkpoints.size + 1}`,
      streamId: input.streamId,
      consumerGroupId: input.consumerGroupId,
      offsets: Object.fromEntries(
        matching.map((item) => [
          String(item.partition),
          item.committedOffset
        ])
      ),
      state: input.state,
      correlationId: input.correlationId,
      createdByIdentityId: input.createdByIdentityId,
      createdAt: new Date().toISOString()
    };

    this.checkpoints.set(checkpoint.id, checkpoint);

    this.audit.record({
      correlationId: input.correlationId,
      category: "checkpoint",
      action: "nervous-checkpoint-created",
      subjectId: checkpoint.id,
      actorIdentityId: input.createdByIdentityId,
      outcome: "success",
      metadata: {
        streamId: checkpoint.streamId,
        partitions: Object.keys(checkpoint.offsets).length
      }
    });

    return checkpoint;
  }

  get(id: string) {
    const checkpoint = this.checkpoints.get(id);

    if (!checkpoint) {
      throw new Error(`Nervous checkpoint not found: ${id}`);
    }

    return checkpoint;
  }

  list() {
    return Array.from(this.checkpoints.values());
  }

  summary() {
    return {
      total: this.checkpoints.size,
      streams: new Set(this.list().map((x) => x.streamId)).size
    };
  }
}
