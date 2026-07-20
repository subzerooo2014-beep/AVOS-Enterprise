import { Module } from '@nestjs/common';
import { AeosMegaPack2Controller } from './aeos-mega-pack-2.controller';
import { AeosMegaPack2OrchestratorService } from './aeos-mega-pack-2-orchestrator.service';
import { Aeos20CertificationService } from './certification/aeos-2.0-certification.service';
import { AeosUnifiedHealthService } from './health/aeos-unified-health.service';
import { AeosProductionReadinessService } from './readiness/aeos-production-readiness.service';
import { AeosUnifiedRegistryService } from './runtime/aeos-unified-registry.service';
import { AeosUnifiedRuntimeService } from './runtime/aeos-unified-runtime.service';
import { AeosUnifiedVerificationService } from './verification/aeos-unified-verification.service';
import { Aeos13Service } from './stages/aeos-1.3/aeos-1.3.service';
import { Aeos14Service } from './stages/aeos-1.4/aeos-1.4.service';
import { Aeos15Service } from './stages/aeos-1.5/aeos-1.5.service';
import { Aeos16Service } from './stages/aeos-1.6/aeos-1.6.service';
import { Aeos17Service } from './stages/aeos-1.7/aeos-1.7.service';
import { Aeos18Service } from './stages/aeos-1.8/aeos-1.8.service';
import { Aeos19Service } from './stages/aeos-1.9/aeos-1.9.service';
import { KnowledgeFabricAdapterService } from './integration/knowledge-fabric-adapter.service';
import { CapabilityFabricAdapterService } from './integration/capability-fabric-adapter.service';
import { EnterpriseBrainAdapterService } from './integration/enterprise-brain-adapter.service';
import { AvosFactoryAdapterService } from './integration/avos-factory-adapter.service';

@Module({
  controllers: [AeosMegaPack2Controller],
  providers: [
    Aeos13Service, Aeos14Service, Aeos15Service, Aeos16Service, Aeos17Service, Aeos18Service, Aeos19Service, KnowledgeFabricAdapterService, CapabilityFabricAdapterService, EnterpriseBrainAdapterService, AvosFactoryAdapterService, AeosUnifiedRegistryService, AeosUnifiedRuntimeService, AeosUnifiedHealthService, AeosUnifiedVerificationService, AeosProductionReadinessService, Aeos20CertificationService, AeosMegaPack2OrchestratorService
  ],
  exports: [
    AeosMegaPack2OrchestratorService,
    AeosUnifiedRuntimeService,
    AeosUnifiedRegistryService,
    AeosUnifiedHealthService,
    AeosUnifiedVerificationService,
    AeosProductionReadinessService,
    Aeos20CertificationService,
  ],
})
export class AeosMegaPack2Module {}
