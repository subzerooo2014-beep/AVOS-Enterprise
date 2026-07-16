import { Module } from "@nestjs/common";
import { CapabilityFabricModule } from "../capability-fabric/capability-fabric.module";
import { CapabilityIntelligenceModule } from "../capability-intelligence/capability-intelligence.module";
import { CapabilityOrchestrationModule } from "../capability-orchestration/capability-orchestration.module";
import { CapabilityRuntimeModule } from "../capability-runtime/capability-runtime.module";
import { CapabilityApprovalService } from "./capability-approval.service";
import { CapabilityArchiveService } from "./capability-archive.service";
import { CapabilityAuditService } from "./capability-audit.service";
import { CapabilityCertificationService } from "./capability-certification.service";
import { CapabilityComplianceService } from "./capability-compliance.service";
import { CapabilityEnterpriseController } from "./capability-enterprise.controller";
import { CapabilityEnterpriseService } from "./capability-enterprise.service";
import { CapabilityMigrationService } from "./capability-migration.service";
import { CapabilityPublishingService } from "./capability-publishing.service";
import { CapabilityTenantService } from "./capability-tenant.service";

@Module({
  imports: [
    CapabilityFabricModule,
    CapabilityRuntimeModule,
    CapabilityOrchestrationModule,
    CapabilityIntelligenceModule,
  ],
  controllers: [CapabilityEnterpriseController],
  providers: [
    CapabilityEnterpriseService,
    CapabilityTenantService,
    CapabilityApprovalService,
    CapabilityAuditService,
    CapabilityComplianceService,
    CapabilityCertificationService,
    CapabilityPublishingService,
    CapabilityMigrationService,
    CapabilityArchiveService,
  ],
  exports: [
    CapabilityEnterpriseService,
    CapabilityTenantService,
    CapabilityApprovalService,
    CapabilityAuditService,
    CapabilityComplianceService,
    CapabilityCertificationService,
    CapabilityPublishingService,
    CapabilityMigrationService,
    CapabilityArchiveService,
  ],
})
export class CapabilityEnterpriseModule {}