import { Injectable } from '@nestjs/common';
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
@Injectable()
export class PlatformIntegrationService {
 constructor(private readonly execution:ExecutionAdapter,private readonly knowledge:KnowledgeAdapter,private readonly intelligence:IntelligenceAdapter,private readonly production:ProductionAdapter,private readonly identity:IdentityAdapter,private readonly notifications:NotificationsAdapter,private readonly files:FilesAdapter,private readonly media:MediaAdapter,private readonly audit:AuditAdapter,private readonly search:SearchAdapter){}
 health(){return [this.execution.health(),this.knowledge.health(),this.intelligence.health(),this.production.health(),this.identity.health(),this.notifications.health(),this.files.health(),this.media.health(),this.audit.health(),this.search.health()];}
}
