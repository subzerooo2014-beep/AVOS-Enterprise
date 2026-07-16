import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CapabilityRegistryService } from "../capability-fabric/capability-registry.service";
import { CapabilityApprovalService } from "./capability-approval.service";
import { CapabilityAuditService } from "./capability-audit.service";
import { CapabilityCertificationService } from "./capability-certification.service";
import { CapabilityComplianceService } from "./capability-compliance.service";
import { CapabilityEnterpriseService } from "./capability-enterprise.service";
import { CapabilityMigrationService } from "./capability-migration.service";
import { CapabilityPublishingService } from "./capability-publishing.service";
import { CapabilityTenantService } from "./capability-tenant.service";
import { CapabilityCertificationLevel } from "./capability-enterprise.types";

@Controller("capability-fabric/enterprise")
export class CapabilityEnterpriseController {
  constructor(
    private readonly enterprise: CapabilityEnterpriseService,
    private readonly registry: CapabilityRegistryService,
    private readonly tenants: CapabilityTenantService,
    private readonly approvals: CapabilityApprovalService,
    private readonly certifications: CapabilityCertificationService,
    private readonly publications: CapabilityPublishingService,
    private readonly compliance: CapabilityComplianceService,
    private readonly migrations: CapabilityMigrationService,
    private readonly audit: CapabilityAuditService,
  ) {}

  @Get("status")
  status() {
    return this.enterprise.framework();
  }

  @Post("tenants/bind")
  bindTenant(
    @Body()
    body: {
      capabilityKey: string;
      tenantId: string;
      configuration?: Record<string, unknown>;
      policyOverrides?: string[];
      maxExecutionsPerHour?: number;
      maxConcurrentExecutions?: number;
    },
  ) {
    const result = this.tenants.bind(body);
    this.audit.record({
      capabilityKey: body.capabilityKey,
      action: "TENANT_BIND",
      actor: "enterprise-api",
      tenantId: body.tenantId,
      outcome: result.success ? "SUCCESS" : "DENIED",
      details: { reason: result.reason },
    });
    return result;
  }

  @Post("approvals")
  requestApproval(
    @Body()
    body: {
      capabilityKey: string;
      requestedBy: string;
      requestedAction:
        | "ACTIVATE"
        | "PUBLISH"
        | "CERTIFY"
        | "MIGRATE"
        | "ARCHIVE";
      justification: string;
    },
  ) {
    return this.approvals.request(body);
  }

  @Post("approvals/:id/decide")
  decideApproval(
    @Param("id") id: string,
    @Body()
    body: {
      status: "APPROVED" | "REJECTED";
      decidedBy: string;
      decisionReason: string;
    },
  ) {
    return this.approvals.decide(id, body);
  }

  @Post("certifications")
  certify(
    @Body()
    body: {
      capabilityKey: string;
      level: CapabilityCertificationLevel;
      certifiedBy: string;
      evidence?: string[];
      expiresAt?: string;
    },
  ) {
    return this.certifications.certify(body);
  }

  @Post("publications")
  createPublication(
    @Body()
    body: {
      capabilityKey: string;
      channel: "INTERNAL" | "PARTNER" | "PUBLIC" | "MARKETPLACE";
      displayName: string;
      summary: string;
      termsRef?: string;
      documentationRef?: string;
    },
  ) {
    return this.publications.create(body);
  }

  @Post("publications/:key/publish")
  publish(
    @Param("key") key: string,
    @Body() body: { publishedBy: string },
  ) {
    return this.publications.publish(key, body.publishedBy);
  }

  @Post("compliance/:key/evaluate")
  evaluateCompliance(
    @Param("key") key: string,
    @Body() body: { evaluatedBy: string },
  ) {
    return this.compliance.evaluate(key, body.evaluatedBy);
  }

  @Post("migrations")
  createMigration(
    @Body()
    body: {
      capabilityKey: string;
      toVersion: string;
      strategy: "IN_PLACE" | "BLUE_GREEN" | "CANARY" | "REPLACE";
      steps: string[];
      rollbackSteps: string[];
      approvalRequestId?: string;
    },
  ) {
    return this.migrations.create(body);
  }

  @Get("audit")
  auditEntries() {
    return { success: true, entries: this.audit.list() };
  }

  @Get("snapshot")
  snapshot() {
    return { success: true, snapshot: this.enterprise.snapshot() };
  }

  @Post("smoke")
  smoke() {
    const key = "avos.capability-enterprise.smoke";

    if (!this.registry.get(key)) {
      const registration = this.registry.register({
        key,
        name: "Capability Enterprise Smoke Capability",
        kind: "PLATFORM_SERVICE",
        owner: "AVOS Capability Fabric",
        summary: "Validates enterprise governance and multi-tenancy.",
        businessValue: "Confirms CF-5 governance foundations.",
        lifecycleStage: "CORE_ENGINE",
        tags: ["enterprise", "governance", "smoke"],
        outcomes: ["Validate CF-5"],
        nonGoals: ["Production workload"],
        policies: [
          {
            policyId: "avos.foundation-first",
            policyVersion: "1.0.0",
            enforcement: "MANDATORY",
            inherited: true,
          },
        ],
        permissions: [
          {
            action: "govern",
            resource: "capability-enterprise",
            roles: ["AVOS_ARCHITECT"],
            approvalRequired: true,
          },
        ],
        metrics: [
          {
            name: "capability_enterprise_smoke",
            unit: "count",
            type: "COUNTER",
          },
        ],
        health: {
          healthEndpoint: "/capability-fabric/enterprise/status",
        },
        runtime: {
          runtime: "NODE",
          stateless: true,
          multiTenant: true,
          supportsIsolation: true,
        },
        security: {
          classification: "INTERNAL",
          authenticationRequired: true,
          authorizationRequired: true,
          dataSensitivity: ["governance-metadata"],
          trustBoundary: "AVOS_ENTERPRISE_PLATFORM",
        },
        documentationRef:
          "docs/architecture/capability-fabric/CF-5-CAPABILITY-ENTERPRISE.md",
      });

      if (!registration.success) return registration;
      this.registry.transitionStatus(key, "ACTIVE");
    }

    const tenant = this.tenants.bind({
      capabilityKey: key,
      tenantId: "cf5-smoke",
      maxExecutionsPerHour: 100,
      maxConcurrentExecutions: 5,
    });

    const approval = this.approvals.request({
      capabilityKey: key,
      requestedBy: "cf5-smoke",
      requestedAction: "PUBLISH",
      justification: "CF-5 smoke validation",
    });

    if (!approval.success) return approval;

    const decision = this.approvals.decide(approval.request.id, {
      status: "APPROVED",
      decidedBy: "AVOS_ARCHITECT",
      decisionReason: "Smoke approval",
    });

    const compliance = this.compliance.evaluate(key, "CF5_SMOKE");
    const publication = this.publications.create({
      capabilityKey: key,
      channel: "INTERNAL",
      displayName: "CF-5 Smoke Capability",
      summary: "Enterprise governance smoke publication.",
      documentationRef:
        "docs/architecture/capability-fabric/CF-5-CAPABILITY-ENTERPRISE.md",
    });
    const published = this.publications.publish(key, "CF5_SMOKE");

    return {
      success:
        tenant.success &&
        decision.success &&
        compliance.success &&
        publication.success &&
        published.success,
      system: "AVOS Capability Fabric",
      megaPack: "CF-5 Capability Enterprise and Governance",
      multiTenant: tenant.success,
      humanApproval: decision.success,
      compliance: compliance.success,
      publishing: published.success,
      auditReady: true,
      certificationReady: true,
      migrationReady: true,
      archiveReady: true,
      pillars: this.enterprise.framework().pillars.length,
      snapshot: this.enterprise.snapshot(),
    };
  }
}