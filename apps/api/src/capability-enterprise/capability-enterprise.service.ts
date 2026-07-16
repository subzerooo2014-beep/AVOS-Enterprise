import { Injectable } from "@nestjs/common";
import {
  CAPABILITY_ENTERPRISE_PILLARS,
  CAPABILITY_ENTERPRISE_VERSION,
} from "./capability-enterprise.registry";
import { CapabilityApprovalService } from "./capability-approval.service";
import { CapabilityArchiveService } from "./capability-archive.service";
import { CapabilityAuditService } from "./capability-audit.service";
import { CapabilityCertificationService } from "./capability-certification.service";
import { CapabilityComplianceService } from "./capability-compliance.service";
import { CapabilityMigrationService } from "./capability-migration.service";
import { CapabilityPublishingService } from "./capability-publishing.service";
import { CapabilityTenantService } from "./capability-tenant.service";
import { CapabilityEnterpriseSnapshot } from "./capability-enterprise.types";

@Injectable()
export class CapabilityEnterpriseService {
  constructor(
    private readonly tenants: CapabilityTenantService,
    private readonly approvals: CapabilityApprovalService,
    private readonly certifications: CapabilityCertificationService,
    private readonly publications: CapabilityPublishingService,
    private readonly compliance: CapabilityComplianceService,
    private readonly migrations: CapabilityMigrationService,
    private readonly archives: CapabilityArchiveService,
    private readonly audit: CapabilityAuditService,
  ) {}

  framework() {
    return {
      success: true,
      system: "AVOS Capability Fabric",
      megaPack: "CF-5 Capability Enterprise and Governance",
      version: CAPABILITY_ENTERPRISE_VERSION,
      architecturalPrinciple: "Foundation First",
      humanFinalAuthority: true,
      status: "OPERATIONAL",
      pillars: [...CAPABILITY_ENTERPRISE_PILLARS],
      snapshot: this.snapshot(),
    };
  }

  snapshot(): CapabilityEnterpriseSnapshot {
    return {
      tenantBindings: this.tenants.list().length,
      pendingApprovals: this.approvals
        .list()
        .filter((request) => request.status === "PENDING").length,
      activeCertifications: this.certifications
        .list()
        .filter((certification) => certification.status === "ACTIVE").length,
      publishedCapabilities: this.publications
        .list()
        .filter((publication) => publication.status === "PUBLISHED").length,
      compliantCapabilities: this.compliance
        .list()
        .filter((evaluation) => evaluation.status === "COMPLIANT").length,
      migrations: this.migrations.list().length,
      archivedCapabilities: this.archives.list().length,
      auditEntries: this.audit.count(),
      generatedAt: new Date().toISOString(),
    };
  }
}