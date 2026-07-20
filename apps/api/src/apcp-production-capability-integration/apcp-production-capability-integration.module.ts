import { Module } from '@nestjs/common';
import { ApcpProductionCapabilityController } from './controllers/apcp-production-capability.controller';
import { ApcpCapabilityRegistryRepository } from './repositories/apcp-capability-registry.repository';
import { ApcpCertificationSnapshotRepository } from './repositories/apcp-certification-snapshot.repository';
import { ApcpProductionCapabilityService } from './services/apcp-production-capability.service';
import { ApcpFactoryIntegrationService } from './services/apcp-factory-integration.service';
import { ApcpUnifiedCertificationIntegrationService } from './services/apcp-unified-certification-integration.service';
import { ApcpProductionE2eOrchestratorService } from './services/apcp-production-e2e-orchestrator.service';

@Module({
  controllers: [ApcpProductionCapabilityController],
  providers: [
    ApcpCapabilityRegistryRepository,
    ApcpCertificationSnapshotRepository,
    ApcpProductionCapabilityService,
    ApcpFactoryIntegrationService,
    ApcpUnifiedCertificationIntegrationService,
    ApcpProductionE2eOrchestratorService,
  ],
  exports: [
    ApcpProductionCapabilityService,
    ApcpFactoryIntegrationService,
    ApcpUnifiedCertificationIntegrationService,
    ApcpProductionE2eOrchestratorService,
  ],
})
export class ApcpProductionCapabilityIntegrationModule {}