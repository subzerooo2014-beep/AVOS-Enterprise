import { Injectable } from "@nestjs/common";
import { RuntimeWorkflowService } from "./services/workflow.service";
import { RuntimeJobService } from "./services/job.service";
import { RuntimeTenantService } from "./services/tenant.service";
import { FeatureFlagService } from "./services/feature-flag.service";
import { RuntimeSecretVaultService } from "./services/secret-vault.service";
import { ConfigCenterService } from "./services/config-center.service";
import { RuntimeCacheService } from "./services/cache.service";
import { NotificationCenterService } from "./services/notification-center.service";
import { AuditTimelineService } from "./services/audit-timeline.service";
import { BackupService } from "./services/backup.service";
@Injectable()
export class EnterprisePlatformRuntimeService {
 constructor(
  readonly workflows:RuntimeWorkflowService,readonly jobs:RuntimeJobService,readonly tenants:RuntimeTenantService,
  readonly flags:FeatureFlagService,readonly secrets:RuntimeSecretVaultService,readonly config:ConfigCenterService,
  readonly cache:RuntimeCacheService,readonly notifications:NotificationCenterService,readonly audit:AuditTimelineService,
  readonly backups:BackupService
 ){}
}
