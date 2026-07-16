import { Injectable } from "@nestjs/common";
import { NervousStreamingHealthIndex } from "../enterprise-nervous-system-mega-pack-4.types";
import { NervousStreamRegistryService } from "../streams/nervous-stream-registry.service";
import { NervousDurableLogService } from "../log/nervous-durable-log.service";
import { NervousOffsetManagerService } from "../offsets/nervous-offset-manager.service";
import { NervousCheckpointService } from "../checkpoints/nervous-checkpoint.service";
import { NervousReplayService } from "../replay/nervous-replay.service";
import { NervousSnapshotService } from "../snapshots/nervous-snapshot.service";
import { NervousRetentionService } from "../retention/nervous-retention.service";
import { NervousCompactionService } from "../compaction/nervous-compaction.service";
import { NervousStreamRecoveryService } from "../recovery/nervous-stream-recovery.service";
import { NervousStreamingAuditService } from "../observability/nervous-streaming-audit.service";

@Injectable()
export class NervousStreamingHealthService {
  private readonly indexes =
    new Map<string, NervousStreamingHealthIndex>();

  constructor(
    private readonly streams: NervousStreamRegistryService,
    private readonly log: NervousDurableLogService,
    private readonly offsets: NervousOffsetManagerService,
    private readonly checkpoints: NervousCheckpointService,
    private readonly replays: NervousReplayService,
    private readonly snapshots: NervousSnapshotService,
    private readonly retention: NervousRetentionService,
    private readonly compaction: NervousCompactionService,
    private readonly recovery: NervousStreamRecoveryService,
    private readonly audit: NervousStreamingAuditService
  ) {}

  list() {
    return Array.from(this.indexes.values());
  }

  calculate(input: {
    actorIdentityId: string;
    correlationId: string;
  }) {
    const streams = this.streams.summary();
    const log = this.log.summary();
    const offsets = this.offsets.summary();
    const checkpoints = this.checkpoints.summary();
    const replays = this.replays.summary();
    const snapshots = this.snapshots.summary();
    const retention = this.retention.summary();
    const compaction = this.compaction.summary();
    const recovery = this.recovery.summary();

    const streamRegistryScore =
      streams.total >= 3 &&
      streams.active === streams.total &&
      streams.degraded === 0 &&
      streams.offline === 0
        ? 100
        : 70;

    const durableLogScore =
      log.checksumProtected ? 100 : 70;

    const offsetScore =
      offsets.totalLag === 0
        ? 100
        : Math.max(0, 100 - offsets.totalLag);

    const checkpointScore =
      checkpoints.total === 0 ? 100 : 100;

    const replayScore =
      replays.failed === 0
        ? 100
        : Math.max(0, 100 - replays.failed * 25);

    const snapshotScore =
      snapshots.total === 0 ? 100 : 100;

    const retentionScore = 100;

    const compactionScore = 100;

    const recoveryScore =
      recovery.failed === 0
        ? 100
        : Math.max(0, 100 - recovery.failed * 30);

    const score = Number(
      (
        streamRegistryScore * 0.15 +
        durableLogScore * 0.2 +
        offsetScore * 0.1 +
        checkpointScore * 0.1 +
        replayScore * 0.15 +
        snapshotScore * 0.1 +
        retentionScore * 0.05 +
        compactionScore * 0.05 +
        recoveryScore * 0.1
      ).toFixed(2)
    );

    const reasons: string[] = [];

    if (streamRegistryScore < 90) {
      reasons.push("Stream registry health is below target.");
    }

    if (durableLogScore < 90) {
      reasons.push("Durable log integrity protection is incomplete.");
    }

    if (offsetScore < 90) {
      reasons.push("Consumer offset lag is above target.");
    }

    if (replayScore < 90) {
      reasons.push("Replay operations contain failures.");
    }

    if (recoveryScore < 90) {
      reasons.push("Recovery operations contain failures.");
    }

    if (reasons.length === 0) {
      reasons.push(
        "Enterprise Nervous System streaming core is healthy."
      );
    }

    const index: NervousStreamingHealthIndex = {
      id: `nervous-streaming-health:${Date.now()}:${this.indexes.size + 1}`,
      score,
      level: this.level(score),
      metrics: {
        streamRegistryScore,
        durableLogScore,
        offsetScore,
        checkpointScore,
        replayScore,
        snapshotScore,
        retentionScore,
        compactionScore,
        recoveryScore
      },
      reasons,
      calculatedAt: new Date().toISOString()
    };

    this.indexes.set(index.id, index);

    this.audit.record({
      correlationId: input.correlationId,
      category: "health",
      action: "nervous-streaming-health-calculated",
      subjectId: index.id,
      actorIdentityId: input.actorIdentityId,
      outcome:
        score >= 75
          ? "success"
          : score >= 50
            ? "warning"
            : "failure",
      metadata: {
        score,
        level: index.level
      }
    });

    return index;
  }

  summary() {
    const items = this.list();

    return {
      total: items.length,
      latestScore:
        items.length === 0
          ? 0
          : items[items.length - 1]?.score ?? 0,
      healthy:
        items.filter(
          (x) =>
            x.level === "healthy" ||
            x.level === "excellent"
        ).length
    };
  }

  private level(
    score: number
  ): NervousStreamingHealthIndex["level"] {
    if (score >= 90) return "excellent";
    if (score >= 75) return "healthy";
    if (score >= 60) return "stable";
    if (score >= 40) return "degraded";
    return "critical";
  }
}
