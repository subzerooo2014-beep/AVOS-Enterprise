import { Injectable } from "@nestjs/common";
import { NervousRecoveryRun } from "../enterprise-nervous-system-mega-pack-4.types";
import { NervousSnapshotService } from "../snapshots/nervous-snapshot.service";
import { NervousCheckpointService } from "../checkpoints/nervous-checkpoint.service";
import { NervousOffsetManagerService } from "../offsets/nervous-offset-manager.service";
import { NervousDurableLogService } from "../log/nervous-durable-log.service";
import { NervousStreamingAuditService } from "../observability/nervous-streaming-audit.service";

@Injectable()
export class NervousStreamRecoveryService {
  private readonly runs =
    new Map<string, NervousRecoveryRun>();

  constructor(
    private readonly snapshots: NervousSnapshotService,
    private readonly checkpoints: NervousCheckpointService,
    private readonly offsets: NervousOffsetManagerService,
    private readonly log: NervousDurableLogService,
    private readonly audit: NervousStreamingAuditService
  ) {}

  recover(input: {
    streamId: string;
    snapshotId?: string;
    checkpointId?: string;
    actorIdentityId: string;
    correlationId: string;
  }) {
    const reasons: string[] = [];
    let recoveredRecords = 0;

    try {
      if (input.snapshotId) {
        const snapshot = this.snapshots.get(input.snapshotId);

        if (snapshot.streamId !== input.streamId) {
          throw new Error("Snapshot does not belong to stream.");
        }

        recoveredRecords = snapshot.recordCount;
        reasons.push("Snapshot restored.");
      }

      if (input.checkpointId) {
        const checkpoint = this.checkpoints.get(input.checkpointId);

        if (checkpoint.streamId !== input.streamId) {
          throw new Error("Checkpoint does not belong to stream.");
        }

        for (const [partition, offset] of Object.entries(checkpoint.offsets)) {
          this.offsets.reset({
            streamId: input.streamId,
            consumerGroupId: checkpoint.consumerGroupId,
            partition: Number(partition),
            offset
          });
        }

        reasons.push("Consumer offsets restored from checkpoint.");
      }

      if (!input.snapshotId && !input.checkpointId) {
        recoveredRecords = this.log.listAll(input.streamId).length;
        reasons.push("Durable log scanned successfully.");
      }

      const run: NervousRecoveryRun = {
        id: `nervous-recovery:${Date.now()}:${this.runs.size + 1}`,
        streamId: input.streamId,
        snapshotId: input.snapshotId,
        checkpointId: input.checkpointId,
        recoveredRecords,
        status: "completed",
        reasons,
        correlationId: input.correlationId,
        createdByIdentityId: input.actorIdentityId,
        createdAt: new Date().toISOString()
      };

      this.runs.set(run.id, run);

      this.audit.record({
        correlationId: input.correlationId,
        category: "recovery",
        action: "nervous-stream-recovery-completed",
        subjectId: run.id,
        actorIdentityId: input.actorIdentityId,
        outcome: "success",
        metadata: {
          recoveredRecords
        }
      });

      return run;
    }
    catch (error) {
      const run: NervousRecoveryRun = {
        id: `nervous-recovery:${Date.now()}:${this.runs.size + 1}`,
        streamId: input.streamId,
        snapshotId: input.snapshotId,
        checkpointId: input.checkpointId,
        recoveredRecords,
        status: "failed",
        reasons: [
          error instanceof Error ? error.message : String(error)
        ],
        correlationId: input.correlationId,
        createdByIdentityId: input.actorIdentityId,
        createdAt: new Date().toISOString()
      };

      this.runs.set(run.id, run);
      return run;
    }
  }

  list() {
    return Array.from(this.runs.values());
  }

  summary() {
    const items = this.list();

    return {
      total: items.length,
      completed: items.filter((x) => x.status === "completed").length,
      failed: items.filter((x) => x.status === "failed").length,
      recoveredRecords:
        items.reduce((sum, item) => sum + item.recoveredRecords, 0)
    };
  }
}
