import { Module } from '@nestjs/common';
import { AvosEnterpriseRuntimeModule } from '../avos-enterprise-runtime/avos-enterprise-runtime.module';
import { RuntimeIntegrationController } from './runtime-integration.controller';
import { RuntimeIntegrationBootstrapService } from './runtime-integration-bootstrap.service';
import { RuntimeIntegrationSnapshotService } from './runtime-integration-snapshot.service';
import { EnterpriseKernelBridgeService } from './kernel/enterprise-kernel-bridge.service';
import { RuntimeEventBridgeService } from './events/runtime-event-bridge.service';
import { CapabilityPersistenceBridgeService } from './capabilities/capability-persistence-bridge.service';
import { DurableRuntimeQueueBridgeService } from './automation/durable-runtime-queue-bridge.service';
import { RuntimeStartupValidationService } from './startup/runtime-startup-validation.service';
import { RuntimeGracefulShutdownService } from './startup/runtime-graceful-shutdown.service';
import { IntegrationHealthAggregatorService } from './observability/integration-health-aggregator.service';
import {
  RUNTIME_PERSISTENCE_REPOSITORY,
} from './persistence/runtime-persistence.repository';
import { MemoryRuntimePersistenceRepository } from './persistence/memory-runtime-persistence.repository';
import { PrismaRuntimePersistenceRepository } from './persistence/prisma-runtime-persistence.repository';
import { RuntimePersistenceService } from './persistence/runtime-persistence.service';

const integrationProviders = [
  RuntimeIntegrationBootstrapService,
  RuntimeIntegrationSnapshotService,
  EnterpriseKernelBridgeService,
  RuntimeEventBridgeService,
  CapabilityPersistenceBridgeService,
  DurableRuntimeQueueBridgeService,
  RuntimeStartupValidationService,
  RuntimeGracefulShutdownService,
  IntegrationHealthAggregatorService,
  MemoryRuntimePersistenceRepository,
  PrismaRuntimePersistenceRepository,
  RuntimePersistenceService,
  {
    provide: RUNTIME_PERSISTENCE_REPOSITORY,
    useExisting: PrismaRuntimePersistenceRepository,
  },
];

@Module({
  imports: [AvosEnterpriseRuntimeModule],
  controllers: [RuntimeIntegrationController],
  providers: integrationProviders,
  exports: integrationProviders,
})
export class AvosRuntimeIntegrationModule {}