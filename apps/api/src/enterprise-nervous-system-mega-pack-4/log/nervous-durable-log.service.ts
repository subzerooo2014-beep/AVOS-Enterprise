import { Injectable } from "@nestjs/common";
import { createHash } from "crypto";
import { NervousStreamRecord } from "../enterprise-nervous-system-mega-pack-4.types";
import { NervousStreamRegistryService } from "../streams/nervous-stream-registry.service";
import { NervousStreamingAuditService } from "../observability/nervous-streaming-audit.service";

@Injectable()
export class NervousDurableLogService {
  private readonly records =
    new Map<string, NervousStreamRecord[]>();

  constructor(
    private readonly streams: NervousStreamRegistryService,
    private readonly audit: NervousStreamingAuditService
  ) {}

  append(input: {
    streamId: string;
    partition?: number;
    key?: string;
    eventType: string;
    payload: unknown;
    headers?: Record<string, string>;
    correlationId: string;
    traceId: string;
    causationId?: string;
    actorIdentityId: string;
  }) {
    const stream = this.streams.get(input.streamId);
    const partition =
      input.partition ??
      this.partitionFor(input.key, stream.partitions);

    if (partition < 0 || partition >= stream.partitions) {
      throw new Error(`Invalid stream partition: ${partition}`);
    }

    const partitionKey = `${stream.id}:${partition}`;
    const partitionRecords = this.records.get(partitionKey) ?? [];
    const offset = partitionRecords.length;

    const serialized = JSON.stringify({
      streamId: stream.id,
      partition,
      offset,
      key: input.key,
      eventType: input.eventType,
      payload: input.payload,
      correlationId: input.correlationId,
      traceId: input.traceId
    });

    const record: NervousStreamRecord = {
      id: `stream-record:${stream.id}:${partition}:${offset}`,
      streamId: stream.id,
      partition,
      offset,
      key: input.key,
      eventType: input.eventType,
      payload: input.payload,
      headers: input.headers ?? {},
      correlationId: input.correlationId,
      traceId: input.traceId,
      causationId: input.causationId,
      checksum: createHash("sha256").update(serialized).digest("hex"),
      createdAt: new Date().toISOString()
    };

    partitionRecords.push(record);
    this.records.set(partitionKey, partitionRecords);

    this.audit.record({
      correlationId: input.correlationId,
      category: "log",
      action: "nervous-stream-record-appended",
      subjectId: record.id,
      actorIdentityId: input.actorIdentityId,
      outcome: "success",
      metadata: {
        streamId: record.streamId,
        partition: record.partition,
        offset: record.offset
      }
    });

    return record;
  }

  read(input: {
    streamId: string;
    partition: number;
    fromOffset?: number;
    toOffset?: number;
    limit?: number;
  }) {
    this.streams.get(input.streamId);

    const partitionKey = `${input.streamId}:${input.partition}`;
    const items = this.records.get(partitionKey) ?? [];
    const from = Math.max(0, input.fromOffset ?? 0);
    const to =
      input.toOffset === undefined
        ? items.length - 1
        : Math.min(items.length - 1, input.toOffset);

    return items
      .filter((item) => item.offset >= from && item.offset <= to)
      .slice(0, Math.max(1, input.limit ?? 1000));
  }

  listAll(streamId: string) {
    const stream = this.streams.get(streamId);
    const items: NervousStreamRecord[] = [];

    for (let partition = 0; partition < stream.partitions; partition += 1) {
      items.push(...this.read({
        streamId,
        partition,
        limit: Number.MAX_SAFE_INTEGER
      }));
    }

    return items.sort(
      (left, right) =>
        new Date(left.createdAt).getTime() -
        new Date(right.createdAt).getTime()
    );
  }

  replacePartition(
    streamId: string,
    partition: number,
    records: NervousStreamRecord[]
  ) {
    this.records.set(
      `${streamId}:${partition}`,
      records.map((record, index) => ({
        ...record,
        offset: index,
        id: `stream-record:${streamId}:${partition}:${index}`
      }))
    );
  }

  latestOffsets(streamId: string) {
    const stream = this.streams.get(streamId);
    const offsets: Record<string, number> = {};

    for (let partition = 0; partition < stream.partitions; partition += 1) {
      const items = this.records.get(`${streamId}:${partition}`) ?? [];
      offsets[String(partition)] =
        items.length === 0
          ? -1
          : items[items.length - 1]?.offset ?? -1;
    }

    return offsets;
  }

  summary() {
    const streamIds = this.streams.list().map((stream) => stream.id);

    return {
      totalRecords: streamIds.reduce(
        (sum, streamId) => sum + this.listAll(streamId).length,
        0
      ),
      streamsWithRecords:
        streamIds.filter((streamId) => this.listAll(streamId).length > 0).length,
      checksumProtected: true
    };
  }

  private partitionFor(key: string | undefined, partitions: number) {
    if (!key) return 0;

    let hash = 0;

    for (let index = 0; index < key.length; index += 1) {
      hash = (hash * 31 + key.charCodeAt(index)) >>> 0;
    }

    return hash % partitions;
  }
}
