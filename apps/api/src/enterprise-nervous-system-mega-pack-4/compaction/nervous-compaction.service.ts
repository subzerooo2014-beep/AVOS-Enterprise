import { Injectable } from "@nestjs/common";
import { NervousCompactionRun } from "../enterprise-nervous-system-mega-pack-4.types";
import { NervousStreamRegistryService } from "../streams/nervous-stream-registry.service";
import { NervousDurableLogService } from "../log/nervous-durable-log.service";
import { NervousStreamingAuditService } from "../observability/nervous-streaming-audit.service";

@Injectable()
export class NervousCompactionService {
  private readonly runs =
    new Map<string, NervousCompactionRun>();

  constructor(
    private readonly streams: NervousStreamRegistryService,
    private readonly log: NervousDurableLogService,
    private readonly audit: NervousStreamingAuditService
  ) {}

  run(input: {
    streamId: string;
    actorIdentityId: string;
    correlationId: string;
  }) {
    const stream = this.streams.get(input.streamId);

    if (!stream.compacted) {
      throw new Error(`Stream is not configured for compaction: ${stream.id}`);
    }

    let beforeRecords = 0;
    let afterRecords = 0;

    for (let partition = 0; partition < stream.partitions; partition += 1) {
      const current = this.log.read({
        streamId: stream.id,
        partition,
        limit: Number.MAX_SAFE_INTEGER
      });

      beforeRecords += current.length;

      const latestByKey = new Map<string, typeof current[number]>();
      const noKey: typeof current = [];

      for (const record of current) {
        if (record.key) {
          latestByKey.set(record.key, record);
        }
        else {
          noKey.push(record);
        }
      }

      const compacted = [
        ...noKey,
        ...Array.from(latestByKey.values())
      ]
      .sort((left, right) => left.offset - right.offset);

      afterRecords += compacted.length;

      this.log.replacePartition(
        stream.id,
        partition,
        compacted
      );
    }

    const run: NervousCompactionRun = {
      id: `nervous-compaction:${Date.now()}:${this.runs.size + 1}`,
      streamId: stream.id,
      beforeRecords,
      afterRecords,
      compactedRecords: beforeRecords - afterRecords,
      correlationId: input.correlationId,
      createdAt: new Date().toISOString()
    };

    this.runs.set(run.id, run);

    this.audit.record({
      correlationId: input.correlationId,
      category: "compaction",
      action: "nervous-stream-compaction-completed",
      subjectId: run.id,
      actorIdentityId: input.actorIdentityId,
      outcome: "success",
      metadata: {
        beforeRecords,
        afterRecords,
        compactedRecords: run.compactedRecords
      }
    });

    return run;
  }

  list() {
    return Array.from(this.runs.values());
  }

  summary() {
    return {
      total: this.runs.size,
      compactedRecords:
        this.list().reduce((sum, run) => sum + run.compactedRecords, 0)
    };
  }
}
