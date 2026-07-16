import { Module } from "@nestjs/common";
import { EnterpriseNervousSystemMegaPack6Controller } from "./enterprise-nervous-system-mega-pack-6.controller";
import { EnterpriseNervousSystemMegaPack6Service } from "./enterprise-nervous-system-mega-pack-6.service";
import { LiveCoordinationAuditService } from "./observability/live-coordination-audit.service";
import { StateChangeFeedService } from "./changes/state-change-feed.service";
import { LiveStateRegistryService } from "./state/live-state-registry.service";
import { PresenceService } from "./presence/presence.service";
import { LiveTelemetryService } from "./telemetry/live-telemetry.service";
import { StateConflictService } from "./conflicts/state-conflict.service";
import { StateSynchronizationService } from "./sync/state-synchronization.service";
import { StateReconciliationService } from "./reconciliation/state-reconciliation.service";
import { LiveCoordinationHealthService } from "./health/live-coordination-health.service";

@Module({
  controllers: [
    EnterpriseNervousSystemMegaPack6Controller
  ],
  providers: [
    EnterpriseNervousSystemMegaPack6Service,
    LiveCoordinationAuditService,
    StateChangeFeedService,
    LiveStateRegistryService,
    PresenceService,
    LiveTelemetryService,
    StateConflictService,
    StateSynchronizationService,
    StateReconciliationService,
    LiveCoordinationHealthService
  ],
  exports: [
    EnterpriseNervousSystemMegaPack6Service,
    LiveCoordinationAuditService,
    StateChangeFeedService,
    LiveStateRegistryService,
    PresenceService,
    LiveTelemetryService,
    StateConflictService,
    StateSynchronizationService,
    StateReconciliationService,
    LiveCoordinationHealthService
  ]
})
export class EnterpriseNervousSystemMegaPack6Module {}
