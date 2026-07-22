import { Module } from '@nestjs/common';
import { MobilityController } from './mobility.controller';
import { MobilityStoreService } from './mobility-store.service';
import { MobilityService } from './mobility.service';
import { MobilityRuntimeService } from './mobility-runtime.service';
import { PlatformIntegrationService } from './platform-integration.service';
import { VerificationService } from './verification.service';
import { CertificationService } from './certification.service';
import { DemoService } from './demo.service';
import { ExecutionAdapter } from './adapters/execution.adapter';
import { KnowledgeAdapter } from './adapters/knowledge.adapter';
import { IntelligenceAdapter } from './adapters/intelligence.adapter';
import { ProductionAdapter } from './adapters/production.adapter';
import { IdentityAdapter } from './adapters/identity.adapter';
import { NotificationsAdapter } from './adapters/notifications.adapter';
import { FilesAdapter } from './adapters/files.adapter';
import { MediaAdapter } from './adapters/media.adapter';
import { AuditAdapter } from './adapters/audit.adapter';
import { SearchAdapter } from './adapters/search.adapter';
@Module({
 controllers:[MobilityController],
 providers:[MobilityStoreService,MobilityService,MobilityRuntimeService,PlatformIntegrationService,VerificationService,CertificationService,DemoService,
    ExecutionAdapter,
    KnowledgeAdapter,
    IntelligenceAdapter,
    ProductionAdapter,
    IdentityAdapter,
    NotificationsAdapter,
    FilesAdapter,
    MediaAdapter,
    AuditAdapter,
    SearchAdapter],
 exports:[MobilityRuntimeService,VerificationService,PlatformIntegrationService]
})
export class AvosMobilityUnifiedMvpModule {}
