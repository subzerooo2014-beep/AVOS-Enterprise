import { Injectable } from "@nestjs/common";
import { NervousStreamSnapshot } from "../enterprise-nervous-system-mega-pack-4.types";
import { NervousDurableLogService } from "../log/nervous-durable-log.service";
import { NervousStreamingAuditService } from "../observability/nervous-streaming-audit.service";

@Injectable()
export class NervousSnapshotService {
  private readonly snapshots =
    new Map<string, NervousStreamSnapshot>();

  constructor(
    private readonly log: NervousDurableLogService,
    private readonly audit: NervousStreamingAuditService
  ) {}

  create(input: {
    streamId: string;
    name: string;
    state: Record<string, unknown>;
    correlationId: string;
    createdByIdentityId: string;
  }) {
    const records = this.log.listAll(input.streamId);

    const snapshot: NervousStreamSnapshot = {
      id: `nervous-snapshot:${Date.now()}:${this.snapshots.size + 1}`,
      streamId: input.streamId,
      name: input.name,
      lastOffsets: this.log.latestOffsets(input.streamId),
      state: input.state,
      recordCount: records.length,
      correlationId: input.correlationId,
      createdByIdentityId: input.createdByIdentityId,
      createdAt: new Date().toISOString()
    };

    this.snapshots.set(snapshot.id, snapshot);

    this.audit.record({
      correlationId: input.correlationId,
      category: "snapshot",
      action: "nervous-stream-snapshot-created",
      subjectId: snapshot.id,
      actorIdentityId: input.createdByIdentityId,
      outcome: "success",
      metadata: {
        streamId: snapshot.streamId,
        recordCount: snapshot.recordCount
      }
    });

    return snapshot;
  }

  get(id: string) {
    const snapshot = this.snapshots.get(id);

    if (!snapshot) {
      throw new Error(`Nervous snapshot not found: ${id}`);
    }

    return snapshot;
  }

  list() {
    return Array.from(this.snapshots.values());
  }

  summary() {
    return {
      total: this.snapshots.size,
      streams: new Set(this.list().map((x) => x.streamId)).size
    };
  }
}
