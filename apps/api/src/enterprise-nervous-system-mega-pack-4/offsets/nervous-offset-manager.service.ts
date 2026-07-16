import { Injectable } from "@nestjs/common";
import { NervousConsumerOffset } from "../enterprise-nervous-system-mega-pack-4.types";
import { NervousDurableLogService } from "../log/nervous-durable-log.service";
import { NervousStreamingAuditService } from "../observability/nervous-streaming-audit.service";

@Injectable()
export class NervousOffsetManagerService {
  private readonly offsets =
    new Map<string, NervousConsumerOffset>();

  constructor(
    private readonly log: NervousDurableLogService,
    private readonly audit: NervousStreamingAuditService
  ) {}

  list() {
    return Array.from(this.offsets.values());
  }

  get(
    streamId: string,
    consumerGroupId: string,
    partition: number
  ) {
    const key = `${streamId}:${consumerGroupId}:${partition}`;
    const existing = this.offsets.get(key);

    if (existing) {
      return existing;
    }

    const latest = this.log.latestOffsets(streamId)[String(partition)] ?? -1;

    const created: NervousConsumerOffset = {
      id: `consumer-offset:${key}`,
      streamId,
      consumerGroupId,
      partition,
      committedOffset: -1,
      lastProcessedOffset: -1,
      lag: latest + 1,
      updatedAt: new Date().toISOString()
    };

    this.offsets.set(key, created);
    return created;
  }

  commit(input: {
    streamId: string;
    consumerGroupId: string;
    partition: number;
    offset: number;
    actorIdentityId: string;
    correlationId: string;
  }) {
    const current = this.get(
      input.streamId,
      input.consumerGroupId,
      input.partition
    );

    const latest =
      this.log.latestOffsets(input.streamId)[String(input.partition)] ?? -1;

    const committed = Math.max(current.committedOffset, input.offset);

    const updated: NervousConsumerOffset = {
      ...current,
      committedOffset: committed,
      lastProcessedOffset: committed,
      lag: Math.max(0, latest - committed),
      updatedAt: new Date().toISOString()
    };

    this.offsets.set(
      `${input.streamId}:${input.consumerGroupId}:${input.partition}`,
      updated
    );

    this.audit.record({
      correlationId: input.correlationId,
      category: "offset",
      action: "nervous-consumer-offset-committed",
      subjectId: updated.id,
      actorIdentityId: input.actorIdentityId,
      outcome: "success",
      metadata: {
        offset: updated.committedOffset,
        lag: updated.lag
      }
    });

    return updated;
  }

  reset(input: {
    streamId: string;
    consumerGroupId: string;
    partition: number;
    offset: number;
  }) {
    const current = this.get(
      input.streamId,
      input.consumerGroupId,
      input.partition
    );

    const latest =
      this.log.latestOffsets(input.streamId)[String(input.partition)] ?? -1;

    const updated: NervousConsumerOffset = {
      ...current,
      committedOffset: input.offset,
      lastProcessedOffset: input.offset,
      lag: Math.max(0, latest - input.offset),
      updatedAt: new Date().toISOString()
    };

    this.offsets.set(
      `${input.streamId}:${input.consumerGroupId}:${input.partition}`,
      updated
    );

    return updated;
  }

  summary() {
    const items = this.list();

    return {
      total: items.length,
      lagging: items.filter((x) => x.lag > 0).length,
      totalLag: items.reduce((sum, item) => sum + item.lag, 0)
    };
  }
}
