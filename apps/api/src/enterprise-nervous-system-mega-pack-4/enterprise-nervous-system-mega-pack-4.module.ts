import { Module } from "@nestjs/common";
import { EnterpriseNervousSystemMegaPack4Controller } from "./enterprise-nervous-system-mega-pack-4.controller";
import { EnterpriseNervousSystemMegaPack4Service } from "./enterprise-nervous-system-mega-pack-4.service";
import { NervousStreamingAuditService } from "./observability/nervous-streaming-audit.service";
import { NervousStreamRegistryService } from "./streams/nervous-stream-registry.service";
import { NervousDurableLogService } from "./log/nervous-durable-log.service";
import { NervousOffsetManagerService } from "./offsets/nervous-offset-manager.service";
import { NervousCheckpointService } from "./checkpoints/nervous-checkpoint.service";
import { NervousSnapshotService } from "./snapshots/nervous-snapshot.service";
import { NervousReplayService } from "./replay/nervous-replay.service";
import { NervousRetentionService } from "./retention/nervous-retention.service";
import { NervousCompactionService } from "./compaction/nervous-compaction.service";
import { NervousStreamRecoveryService } from "./recovery/nervous-stream-recovery.service";
import { NervousStreamingHealthService } from "./health/nervous-streaming-health.service";

@Module({
  controllers: [
    EnterpriseNervousSystemMegaPack4Controller
  ],
  providers: [
    EnterpriseNervousSystemMegaPack4Service,
    NervousStreamingAuditService,
    NervousStreamRegistryService,
    NervousDurableLogService,
    NervousOffsetManagerService,
    NervousCheckpointService,
    NervousSnapshotService,
    NervousReplayService,
    NervousRetentionService,
    NervousCompactionService,
    NervousStreamRecoveryService,
    NervousStreamingHealthService
  ],
  exports: [
    EnterpriseNervousSystemMegaPack4Service,
    NervousStreamingAuditService,
    NervousStreamRegistryService,
    NervousDurableLogService,
    NervousOffsetManagerService,
    NervousCheckpointService,
    NervousSnapshotService,
    NervousReplayService,
    NervousRetentionService,
    NervousCompactionService,
    NervousStreamRecoveryService,
    NervousStreamingHealthService
  ]
})
export class EnterpriseNervousSystemMegaPack4Module {}
