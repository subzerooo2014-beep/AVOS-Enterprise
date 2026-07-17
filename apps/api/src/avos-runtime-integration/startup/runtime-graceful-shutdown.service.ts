import {
  BeforeApplicationShutdown,
  Injectable,
  Logger,
} from '@nestjs/common';
import { DurableRuntimeQueueBridgeService } from '../automation/durable-runtime-queue-bridge.service';
import { CapabilityPersistenceBridgeService } from '../capabilities/capability-persistence-bridge.service';
import { RuntimeEventBridgeService } from '../events/runtime-event-bridge.service';

@Injectable()
export class RuntimeGracefulShutdownService
  implements BeforeApplicationShutdown
{
  private readonly logger = new Logger(
    RuntimeGracefulShutdownService.name,
  );

  constructor(
    private readonly queueBridge: DurableRuntimeQueueBridgeService,
    private readonly capabilityBridge: CapabilityPersistenceBridgeService,
    private readonly eventBridge: RuntimeEventBridgeService,
  ) {}

  async beforeApplicationShutdown(signal?: string): Promise<void> {
    this.logger.log(
      `Runtime graceful shutdown started${signal ? ` (${signal})` : ''}`,
    );

    await this.queueBridge.persistJobs();
    await this.capabilityBridge.synchronize();
    this.eventBridge.onModuleDestroy();

    this.logger.log('Runtime graceful shutdown completed');
  }
}