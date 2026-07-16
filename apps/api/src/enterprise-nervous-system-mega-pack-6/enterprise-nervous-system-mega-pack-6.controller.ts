import {
  Body,
  Controller,
  Get,
  Param,
  Post
} from "@nestjs/common";
import { EnterpriseNervousSystemMegaPack6Service } from "./enterprise-nervous-system-mega-pack-6.service";
import { LiveStateRegistryService } from "./state/live-state-registry.service";
import { StateSynchronizationService } from "./sync/state-synchronization.service";
import { StateChangeFeedService } from "./changes/state-change-feed.service";
import { PresenceService } from "./presence/presence.service";
import { LiveTelemetryService } from "./telemetry/live-telemetry.service";
import { StateConflictService } from "./conflicts/state-conflict.service";
import { StateReconciliationService } from "./reconciliation/state-reconciliation.service";
import { LiveCoordinationHealthService } from "./health/live-coordination-health.service";
import { LiveCoordinationAuditService } from "./observability/live-coordination-audit.service";
import {
  PresenceStatus,
  ReconciliationResult,
  TelemetryMetric
} from "./enterprise-nervous-system-mega-pack-6.types";

@Controller("enterprise-nervous-system-v6")
export class EnterpriseNervousSystemMegaPack6Controller {
  constructor(
    private readonly pack: EnterpriseNervousSystemMegaPack6Service,
    private readonly states: LiveStateRegistryService,
    private readonly sync: StateSynchronizationService,
    private readonly changes: StateChangeFeedService,
    private readonly presence: PresenceService,
    private readonly telemetry: LiveTelemetryService,
    private readonly conflicts: StateConflictService,
    private readonly reconciliation: StateReconciliationService,
    private readonly health: LiveCoordinationHealthService,
    private readonly audit: LiveCoordinationAuditService
  ) {}

  @Get("status")
  status() {
    return this.pack.status();
  }

  @Get("verification")
  verification() {
    return this.pack.verification();
  }

  @Get("states")
  stateList() {
    return {
      summary: this.states.summary(),
      items: this.states.list()
    };
  }

  @Post("states")
  setState(
    @Body()
    body: {
      namespace: string;
      key: string;
      value: unknown;
      expectedVersion?: number;
      sourceNodeId: string;
      ownerIdentityId: string;
      vectorClock?: Record<string, number>;
      metadata?: Record<string, unknown>;
      correlationId: string;
      traceId: string;
    }
  ) {
    return this.states.set(body);
  }

  @Post("sync")
  synchronize(
    @Body()
    body: {
      namespace: string;
      key: string;
      sourceNodeId: string;
      targetNodeId: string;
      expectedVersion?: number;
      payload: unknown;
      vectorClock: Record<string, number>;
      ownerIdentityId: string;
      correlationId: string;
      traceId: string;
    }
  ) {
    return this.sync.synchronize(body);
  }

  @Get("sync")
  syncList() {
    return {
      summary: this.sync.summary(),
      items: this.sync.list()
    };
  }

  @Get("changes")
  changeList() {
    return {
      summary: this.changes.summary(),
      items: this.changes.list()
    };
  }

  @Post("presence/heartbeat")
  heartbeat(
    @Body()
    body: {
      identityId: string;
      nodeId: string;
      status: PresenceStatus;
      capabilities: string[];
      ttlSeconds?: number;
      metadata?: Record<string, unknown>;
      correlationId: string;
    }
  ) {
    return this.presence.heartbeat(body);
  }

  @Get("presence")
  presenceList() {
    return {
      summary: this.presence.summary(),
      items: this.presence.list()
    };
  }

  @Post("telemetry")
  captureTelemetry(
    @Body()
    body: Omit<TelemetryMetric, "id" | "capturedAt">
  ) {
    return this.telemetry.capture(body);
  }

  @Get("telemetry")
  telemetryList() {
    return {
      summary: this.telemetry.summary(),
      items: this.telemetry.list()
    };
  }

  @Get("conflicts")
  conflictList() {
    return {
      summary: this.conflicts.summary(),
      items: this.conflicts.list()
    };
  }

  @Post("conflicts/:id/reconcile")
  reconcile(
    @Param("id") id: string,
    @Body()
    body: {
      strategy: ReconciliationResult["strategy"];
      sourcePriority?: "local" | "incoming";
      humanApproved: boolean;
      resolvedByIdentityId: string;
      correlationId: string;
      traceId: string;
    }
  ) {
    return this.reconciliation.reconcile({
      conflictId: id,
      ...body
    });
  }

  @Get("reconciliation")
  reconciliationList() {
    return {
      summary: this.reconciliation.summary(),
      items: this.reconciliation.list()
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
