import {
  Body,
  Controller,
  Get,
  Param,
  Post
} from "@nestjs/common";
import { EnterpriseNervousSystemMegaPack4Service } from "./enterprise-nervous-system-mega-pack-4.service";
import { NervousStreamRegistryService } from "./streams/nervous-stream-registry.service";
import { NervousDurableLogService } from "./log/nervous-durable-log.service";
import { NervousOffsetManagerService } from "./offsets/nervous-offset-manager.service";
import { NervousCheckpointService } from "./checkpoints/nervous-checkpoint.service";
import { NervousReplayService } from "./replay/nervous-replay.service";
import { NervousSnapshotService } from "./snapshots/nervous-snapshot.service";
import { NervousRetentionService } from "./retention/nervous-retention.service";
import { NervousCompactionService } from "./compaction/nervous-compaction.service";
import { NervousStreamRecoveryService } from "./recovery/nervous-stream-recovery.service";
import { NervousStreamingHealthService } from "./health/nervous-streaming-health.service";
import { NervousStreamingAuditService } from "./observability/nervous-streaming-audit.service";
import { NervousStreamDefinition } from "./enterprise-nervous-system-mega-pack-4.types";

@Controller("enterprise-nervous-system-v4")
export class EnterpriseNervousSystemMegaPack4Controller {
  constructor(
    private readonly pack: EnterpriseNervousSystemMegaPack4Service,
    private readonly streams: NervousStreamRegistryService,
    private readonly log: NervousDurableLogService,
    private readonly offsets: NervousOffsetManagerService,
    private readonly checkpoints: NervousCheckpointService,
    private readonly replays: NervousReplayService,
    private readonly snapshots: NervousSnapshotService,
    private readonly retention: NervousRetentionService,
    private readonly compaction: NervousCompactionService,
    private readonly recovery: NervousStreamRecoveryService,
    private readonly health: NervousStreamingHealthService,
    private readonly audit: NervousStreamingAuditService
  ) {}

  @Get("status")
  status() {
    return this.pack.status();
  }

  @Get("verification")
  verification() {
    return this.pack.verification();
  }

  @Get("streams")
  streamList() {
    return {
      summary: this.streams.summary(),
      items: this.streams.list()
    };
  }

  @Post("streams")
  registerStream(
    @Body()
    body: {
      stream: Omit<
        NervousStreamDefinition,
        "createdAt" | "updatedAt"
      >;
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.streams.register(
      body.stream,
      {
        actorIdentityId: body.actorIdentityId,
        correlationId: body.correlationId
      }
    );
  }

  @Post("records")
  appendRecord(
    @Body()
    body: {
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
    }
  ) {
    return this.log.append(body);
  }

  @Post("records/read")
  readRecords(
    @Body()
    body: {
      streamId: string;
      partition: number;
      fromOffset?: number;
      toOffset?: number;
      limit?: number;
    }
  ) {
    return this.log.read(body);
  }

  @Get("offsets")
  offsetList() {
    return {
      summary: this.offsets.summary(),
      items: this.offsets.list()
    };
  }

  @Post("offsets/commit")
  commitOffset(
    @Body()
    body: {
      streamId: string;
      consumerGroupId: string;
      partition: number;
      offset: number;
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.offsets.commit(body);
  }

  @Post("checkpoints")
  createCheckpoint(
    @Body()
    body: {
      streamId: string;
      consumerGroupId: string;
      state: Record<string, unknown>;
      correlationId: string;
      createdByIdentityId: string;
    }
  ) {
    return this.checkpoints.create(body);
  }

  @Get("checkpoints")
  checkpointList() {
    return {
      summary: this.checkpoints.summary(),
      items: this.checkpoints.list()
    };
  }

  @Post("snapshots")
  createSnapshot(
    @Body()
    body: {
      streamId: string;
      name: string;
      state: Record<string, unknown>;
      correlationId: string;
      createdByIdentityId: string;
    }
  ) {
    return this.snapshots.create(body);
  }

  @Get("snapshots")
  snapshotList() {
    return {
      summary: this.snapshots.summary(),
      items: this.snapshots.list()
    };
  }

  @Post("replays")
  createReplay(
    @Body()
    body: {
      streamId: string;
      consumerGroupId: string;
      fromOffsets: Record<string, number>;
      toOffsets?: Record<string, number>;
      filterEventTypes?: string[];
      dryRun: boolean;
      createdByIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.replays.create(body);
  }

  @Post("replays/:id/approve")
  approveReplay(
    @Param("id") id: string,
    @Body()
    body: {
      approvedByIdentityId: string;
    }
  ) {
    return this.replays.approve({
      replayId: id,
      ...body
    });
  }

  @Post("replays/:id/run")
  runReplay(
    @Param("id") id: string,
    @Body()
    body: {
      actorIdentityId: string;
    }
  ) {
    return this.replays.run({
      replayId: id,
      ...body
    });
  }

  @Get("replays")
  replayList() {
    return {
      summary: this.replays.summary(),
      items: this.replays.list()
    };
  }

  @Post("retention/run")
  runRetention(
    @Body()
    body: {
      streamId: string;
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.retention.run(body);
  }

  @Post("compaction/run")
  runCompaction(
    @Body()
    body: {
      streamId: string;
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.compaction.run(body);
  }

  @Post("recovery/run")
  runRecovery(
    @Body()
    body: {
      streamId: string;
      snapshotId?: string;
      checkpointId?: string;
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.recovery.recover(body);
  }

  @Get("recovery")
  recoveryList() {
    return {
      summary: this.recovery.summary(),
      items: this.recovery.list()
    };
  }

  @Post("health/calculate")
  calculateHealth(
    @Body()
    body: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.health.calculate(body);
  }

  @Get("health")
  healthList() {
    return {
      summary: this.health.summary(),
      items: this.health.list()
    };
  }

  @Get("audit")
  auditList() {
    return {
      summary: this.audit.summary(),
      items: this.audit.list()
    };
  }
}
