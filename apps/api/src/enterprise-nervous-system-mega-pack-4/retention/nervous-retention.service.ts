import { Injectable } from "@nestjs/common";
import { NervousRetentionRun } from "../enterprise-nervous-system-mega-pack-4.types";
import { NervousStreamRegistryService } from "../streams/nervous-stream-registry.service";
import { NervousDurableLogService } from "../log/nervous-durable-log.service";
import { NervousStreamingAuditService } from "../observability/nervous-streaming-audit.service";

@Injectable()
export class NervousRetentionService {
  private readonly runs =
    new Map<string, NervousRetentionRun>();

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
    const cutoff =
      Date.now() - stream.retentionHours * 60 * 60 * 1000;

    let removedRecords = 0;
    let remainingRecords = 0;

    for (let partition = 0; partition < stream.partitions; partition += 1) {
      const current = this.log.read({
        streamId: stream.id,
        partition,
        limit: Number.MAX_SAFE_INTEGER
      });

      const kept = current.filter(
        (record) =>
          new Date(record.createdAt).getTime() >= cutoff
      );

      removedRecords += current.length - kept.length;
      remainingRecords += kept.length;

      this.log.replacePartition(
        stream.id,
        partition,
        kept
      );
    }

    const run: NervousRetentionRun = {
      id: `nervous-retention:${Date.now()}:${this.runs.size + 1}`,
      streamId: stream.id,
      removedRecords,
      remainingRecords,
      retentionHours: stream.retentionHours,
      correlationId: input.correlationId,
      createdAt: new Date().toISOString()
    };

    this.runs.set(run.id, run);

    this.audit.record({
      correlationId: input.correlationId,
      category: "retention",
      action: "nervous-stream-retention-run-completed",
      subjectId: run.id,
      actorIdentityId: input.actorIdentityId,
      outcome: "success",
      metadata: {
        removedRecords,
        remainingRecords
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
      removedRecords:
        this.list().reduce((sum, run) => sum + run.removedRecords, 0)
    };
  }
}
