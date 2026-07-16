import {
  ConflictException,
  Injectable
} from "@nestjs/common";
import { NervousReplayRequest } from "../enterprise-nervous-system-mega-pack-4.types";
import { NervousStreamRegistryService } from "../streams/nervous-stream-registry.service";
import { NervousDurableLogService } from "../log/nervous-durable-log.service";
import { NervousOffsetManagerService } from "../offsets/nervous-offset-manager.service";
import { NervousStreamingAuditService } from "../observability/nervous-streaming-audit.service";

@Injectable()
export class NervousReplayService {
  private readonly requests =
    new Map<string, NervousReplayRequest>();

  constructor(
    private readonly streams: NervousStreamRegistryService,
    private readonly log: NervousDurableLogService,
    private readonly offsets: NervousOffsetManagerService,
    private readonly audit: NervousStreamingAuditService
  ) {}

  create(input: {
    streamId: string;
    consumerGroupId: string;
    fromOffsets: Record<string, number>;
    toOffsets?: Record<string, number>;
    filterEventTypes?: string[];
    dryRun: boolean;
    createdByIdentityId: string;
    correlationId: string;
  }) {
    this.streams.get(input.streamId);

    const now = new Date().toISOString();

    const request: NervousReplayRequest = {
      id: `nervous-replay:${Date.now()}:${this.requests.size + 1}`,
      streamId: input.streamId,
      consumerGroupId: input.consumerGroupId,
      fromOffsets: input.fromOffsets,
      toOffsets: input.toOffsets,
      filterEventTypes: Array.from(new Set(input.filterEventTypes ?? [])),
      dryRun: input.dryRun,
      status: "created",
      replayedRecords: 0,
      failedRecords: 0,
      correlationId: input.correlationId,
      createdByIdentityId: input.createdByIdentityId,
      createdAt: now,
      updatedAt: now
    };

    this.requests.set(request.id, request);
    return request;
  }

  approve(input: {
    replayId: string;
    approvedByIdentityId: string;
  }) {
    const current = this.get(input.replayId);

    const updated: NervousReplayRequest = {
      ...current,
      approvedByIdentityId: input.approvedByIdentityId,
      updatedAt: new Date().toISOString()
    };

    this.requests.set(updated.id, updated);
    return updated;
  }

  run(input: {
    replayId: string;
    actorIdentityId: string;
  }) {
    const current = this.get(input.replayId);
    const stream = this.streams.get(current.streamId);

    if (
      !current.dryRun &&
      !current.approvedByIdentityId
    ) {
      throw new ConflictException(
        "Non-dry-run replay requires human approval."
      );
    }

    const running: NervousReplayRequest = {
      ...current,
      status: "running",
      updatedAt: new Date().toISOString()
    };

    this.requests.set(running.id, running);

    let replayedRecords = 0;
    let failedRecords = 0;

    for (let partition = 0; partition < stream.partitions; partition += 1) {
      const fromOffset =
        current.fromOffsets[String(partition)] ?? 0;

      const toOffset =
        current.toOffsets?.[String(partition)];

      const records = this.log.read({
        streamId: current.streamId,
        partition,
        fromOffset,
        toOffset,
        limit: Number.MAX_SAFE_INTEGER
      })
      .filter(
        (record) =>
          current.filterEventTypes.length === 0 ||
          current.filterEventTypes.includes(record.eventType)
      );

      for (const record of records) {
        try {
          replayedRecords += 1;

          if (!current.dryRun) {
            this.offsets.commit({
              streamId: current.streamId,
              consumerGroupId: current.consumerGroupId,
              partition,
              offset: record.offset,
              actorIdentityId: input.actorIdentityId,
              correlationId: current.correlationId
            });
          }
        }
        catch {
          failedRecords += 1;
        }
      }
    }

    const completed: NervousReplayRequest = {
      ...running,
      status: failedRecords === 0 ? "completed" : "failed",
      replayedRecords,
      failedRecords,
      updatedAt: new Date().toISOString(),
      completedAt: new Date().toISOString()
    };

    this.requests.set(completed.id, completed);

    this.audit.record({
      correlationId: current.correlationId,
      category: "replay",
      action: "nervous-stream-replay-completed",
      subjectId: completed.id,
      actorIdentityId: input.actorIdentityId,
      outcome: failedRecords === 0 ? "success" : "failure",
      metadata: {
        replayedRecords,
        failedRecords,
        dryRun: completed.dryRun
      }
    });

    return completed;
  }

  get(id: string) {
    const request = this.requests.get(id);

    if (!request) {
      throw new Error(`Nervous replay request not found: ${id}`);
    }

    return request;
  }

  list() {
    return Array.from(this.requests.values());
  }

  summary() {
    const items = this.list();

    return {
      total: items.length,
      completed: items.filter((x) => x.status === "completed").length,
      failed: items.filter((x) => x.status === "failed").length,
      running: items.filter((x) => x.status === "running").length,
      replayedRecords:
        items.reduce((sum, item) => sum + item.replayedRecords, 0)
    };
  }
}
