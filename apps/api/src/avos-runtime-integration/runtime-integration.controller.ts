import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { RuntimeIntegrationBootstrapService } from './runtime-integration-bootstrap.service';
import { RuntimeIntegrationSnapshotService } from './runtime-integration-snapshot.service';
import { IntegrationHealthAggregatorService } from './observability/integration-health-aggregator.service';
import { RuntimePersistenceService } from './persistence/runtime-persistence.service';
import { EnterpriseKernelBridgeService } from './kernel/enterprise-kernel-bridge.service';
import { RuntimeEventBridgeService } from './events/runtime-event-bridge.service';
import { CapabilityPersistenceBridgeService } from './capabilities/capability-persistence-bridge.service';
import { DurableRuntimeQueueBridgeService } from './automation/durable-runtime-queue-bridge.service';
import { RuntimeStartupValidationService } from './startup/runtime-startup-validation.service';

@Controller('avos/runtime-integration')
export class RuntimeIntegrationController {
  constructor(
    private readonly bootstrap: RuntimeIntegrationBootstrapService,
    private readonly snapshot: RuntimeIntegrationSnapshotService,
    private readonly health: IntegrationHealthAggregatorService,
    private readonly persistence: RuntimePersistenceService,
    private readonly kernel: EnterpriseKernelBridgeService,
    private readonly events: RuntimeEventBridgeService,
    private readonly capabilities: CapabilityPersistenceBridgeService,
    private readonly queue: DurableRuntimeQueueBridgeService,
    private readonly validation: RuntimeStartupValidationService,
  ) {}

  @Get('status')
  async status() {
    return {
      success: true,
      integration: 'AVOS Enterprise Runtime Integration',
      version: '1.0.0',
      bootstrap: this.bootstrap.status(),
      snapshot: await this.snapshot.create(),
    };
  }

  @Post('initialize')
  initialize() {
    return this.bootstrap.initialize();
  }

  @Get('health')
  healthStatus() {
    return this.health.snapshot();
  }

  @Get('validation')
  validate() {
    return this.validation.validate();
  }

  @Get('kernel')
  kernelRegistrations() {
    return {
      success: true,
      total: this.kernel.count(),
      mode: this.kernel.mode(),
      items: this.kernel.list(),
    };
  }

  @Post('capabilities/synchronize')
  synchronizeCapabilities() {
    return this.capabilities.synchronize();
  }

  @Post('queue/persist')
  async persistQueue() {
    return {
      success: true,
      persisted: await this.queue.persistJobs(),
    };
  }

  @Post('queue/restore')
  async restoreQueue() {
    return {
      success: true,
      restored: await this.queue.restoreQueuedJobs(),
    };
  }

  @Post('events')
  publishEvent(
    @Body()
    body: {
      type: string;
      source?: string;
      payload?: unknown;
    },
  ) {
    return this.events.publish(
      body.type,
      body.source ?? 'runtime-integration-api',
      body.payload ?? {},
    );
  }

  @Get('records')
  async records(
    @Query('namespace') namespace = 'capabilities',
    @Query('type') type?: string,
  ) {
    const items = await this.persistence.list(namespace, type);
    return {
      success: true,
      total: items.length,
      items,
    };
  }

  @Get('records/:namespace/:key')
  record(
    @Param('namespace') namespace: string,
    @Param('key') key: string,
  ) {
    return this.persistence.get(namespace, key);
  }

  @Post('records/:namespace/:key')
  saveRecord(
    @Param('namespace') namespace: string,
    @Param('key') key: string,
    @Body()
    body: {
      type?: string;
      payload?: unknown;
      status?: string;
    },
  ) {
    return this.persistence.save(
      namespace,
      body.type ?? 'generic',
      key,
      body.payload ?? {},
      body.status ?? 'active',
    );
  }

  @Delete('records/:namespace/:key')
  async deleteRecord(
    @Param('namespace') namespace: string,
    @Param('key') key: string,
  ) {
    return {
      success: await this.persistence.remove(namespace, key),
    };
  }
}