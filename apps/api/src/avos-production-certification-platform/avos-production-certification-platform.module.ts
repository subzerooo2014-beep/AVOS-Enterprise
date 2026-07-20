import { Module } from '@nestjs/common';
import { AuditTrailService } from './application/audit-trail.service';
import { CertificationEngineService } from './application/certification-engine.service';
import { ContinuousMonitoringService } from './application/continuous-monitoring.service';
import { DeploymentGateService } from './application/deployment-gate.service';
import { EvidenceCollectionService } from './application/evidence-collection.service';
import { EvidenceValidationService } from './application/evidence-validation.service';
import { ManifestEngineService } from './application/manifest-engine.service';
import { PlatformRegistryService } from './application/platform-registry.service';
import { ProductionIntelligenceService } from './application/production-intelligence.service';
import { AvosProductionCertificationPlatformController } from './avos-production-certification-platform.controller';
import { DefaultDeploymentGateAdapter } from './infrastructure/default-deployment-gate.adapter';
import { InMemoryEvidenceRepository } from './infrastructure/in-memory-evidence.repository';
import { LocalEvidenceCollector } from './infrastructure/local-evidence.collector';
import { PlatformStatusService } from './platform-status.service';
import { DEPLOYMENT_GATE, EVIDENCE_COLLECTOR, EVIDENCE_REPOSITORY } from './tokens';

@Module({
  controllers: [AvosProductionCertificationPlatformController],
  providers: [
    AuditTrailService,
    CertificationEngineService,
    ContinuousMonitoringService,
    DeploymentGateService,
    EvidenceCollectionService,
    EvidenceValidationService,
    ManifestEngineService,
    PlatformRegistryService,
    ProductionIntelligenceService,
    PlatformStatusService,
    InMemoryEvidenceRepository,
    LocalEvidenceCollector,
    DefaultDeploymentGateAdapter,
    {
      provide: EVIDENCE_REPOSITORY,
      useExisting: InMemoryEvidenceRepository,
    },
    {
      provide: EVIDENCE_COLLECTOR,
      useExisting: LocalEvidenceCollector,
    },
    {
      provide: DEPLOYMENT_GATE,
      useExisting: DefaultDeploymentGateAdapter,
    },
  ],
  exports: [
    CertificationEngineService,
    ContinuousMonitoringService,
    DeploymentGateService,
    EvidenceCollectionService,
    PlatformRegistryService,
    PlatformStatusService,
  ],
})
export class AvosProductionCertificationPlatformModule {}
