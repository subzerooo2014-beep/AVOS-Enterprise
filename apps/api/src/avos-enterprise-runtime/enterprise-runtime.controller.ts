import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { EnterpriseRuntimeBootstrapService } from './enterprise-runtime-bootstrap.service';
import { EnterpriseRuntimeSnapshotService } from './enterprise-runtime-snapshot.service';
import { CapabilityRegistryService } from './capabilities/capability-registry.service';
import { RuntimeHealthService } from './observability/runtime-health.service';
import { RuntimeDiagnosticsService } from './observability/runtime-diagnostics.service';
import { RuntimeEventStoreService } from './events/runtime-event-store.service';
import { RuntimeEventReplayService } from './events/runtime-event-replay.service';
import { RuntimeQueueService } from './automation/runtime-queue.service';
import { RuntimeJobEngineService } from './automation/runtime-job-engine.service';
import { HumanApprovalService } from './governance/human-approval.service';

@Controller('avos/runtime')
export class EnterpriseRuntimeController {
  constructor(
    private readonly bootstrap: EnterpriseRuntimeBootstrapService,
    private readonly snapshot: EnterpriseRuntimeSnapshotService,
    private readonly registry: CapabilityRegistryService,
    private readonly health: RuntimeHealthService,
    private readonly diagnostics: RuntimeDiagnosticsService,
    private readonly events: RuntimeEventStoreService,
    private readonly replay: RuntimeEventReplayService,
    private readonly queue: RuntimeQueueService,
    private readonly jobs: RuntimeJobEngineService,
    private readonly approvals: HumanApprovalService,
  ) {}

  @Get('status')
  status() {
    return {
      success: true,
      runtime: 'AVOS Enterprise Runtime',
      version: '1.0.0',
      boot: this.bootstrap.status(),
      snapshot: this.snapshot.create(),
    };
  }

  @Post('boot')
  boot() {
    return this.bootstrap.boot();
  }

  @Get('capabilities')
  capabilities() {
    return {
      success: true,
      total: this.registry.count(),
      items: this.registry.list(),
    };
  }

  @Get('capabilities/:id')
  capability(@Param('id') id: string) {
    return this.registry.get(id);
  }

  @Get('health')
  healthStatus() {
    return this.health.snapshot();
  }

  @Get('diagnostics')
  diagnosticsStatus() {
    return this.diagnostics.run();
  }

  @Get('events')
  eventHistory(@Query('type') type?: string) {
    return {
      success: true,
      total: this.events.list(type).length,
      items: this.events.list(type),
    };
  }

  @Post('events/replay')
  replayEvents(@Body() body: { type?: string }) {
    return {
      success: true,
      replayed: this.replay.replay(body.type).length,
    };
  }

  @Get('jobs')
  listJobs() {
    return {
      success: true,
      total: this.queue.count(),
      items: this.queue.list(),
    };
  }

  @Post('jobs')
  enqueueJob(
    @Body()
    body: {
      type: string;
      payload?: unknown;
      maxAttempts?: number;
    },
  ) {
    return this.queue.enqueue(
      body.type,
      body.payload ?? {},
      body.maxAttempts ?? 3,
    );
  }

  @Post('jobs/run-next')
  runNextJob(@Body() body: { type?: string }) {
    return this.jobs.runNext(body.type);
  }

  @Get('approvals')
  listApprovals() {
    return {
      success: true,
      total: this.approvals.count(),
      items: this.approvals.list(),
    };
  }

  @Post('approvals/:id/resolve')
  resolveApproval(
    @Param('id') id: string,
    @Body()
    body: {
      resolution: 'approved' | 'rejected';
      resolvedBy: string;
      reason?: string;
    },
  ) {
    return this.approvals.resolve(
      id,
      body.resolution,
      body.resolvedBy,
      body.reason,
    );
  }
}