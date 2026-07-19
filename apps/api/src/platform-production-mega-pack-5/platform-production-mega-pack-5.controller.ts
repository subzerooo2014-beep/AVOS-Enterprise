import { Body, Controller, Get, Post } from "@nestjs/common";
import { PlatformProductionMegaPack5StatusService } from "./platform-production-mega-pack-5-status.service";
import { PlatformProductionMegaPack5AssuranceService } from "./platform-production-mega-pack-5-assurance.service";
import { PlatformSecurityControlService } from "./platform-security-control.service";
import { RuntimeIdentityService } from "./runtime-identity.service";
import { ServiceAuthenticationService } from "./service-authentication.service";
import { AuthorizationPoliciesService } from "./authorization-policies.service";
import { SecretsManagementService } from "./secrets-management.service";
import { EncryptionControlService } from "./encryption-control.service";
import { ZeroTrustServiceAccessService } from "./zero-trust-service-access.service";
import { ThreatDetectionService } from "./threat-detection.service";
import { SecurityIncidentIntegrationService } from "./security-incident-integration.service";
import { UnifiedSecurityDashboardService } from "./unified-security-dashboard.service";
import { SecurityAuditService } from "./security-audit.service";

@Controller("avos/platform/production/mega-pack-5")
export class PlatformProductionMegaPack5Controller {
  constructor(
    private readonly statusService: PlatformProductionMegaPack5StatusService,
    private readonly assurance: PlatformProductionMegaPack5AssuranceService,
    private readonly control: PlatformSecurityControlService,
    private readonly identities: RuntimeIdentityService,
    private readonly authentication: ServiceAuthenticationService,
    private readonly policies: AuthorizationPoliciesService,
    private readonly secrets: SecretsManagementService,
    private readonly encryption: EncryptionControlService,
    private readonly zeroTrust: ZeroTrustServiceAccessService,
    private readonly threats: ThreatDetectionService,
    private readonly incidents: SecurityIncidentIntegrationService,
    private readonly dashboard: UnifiedSecurityDashboardService,
    private readonly audit: SecurityAuditService,
  ) {}

  @Get("status")
  status() {
    return this.statusService.status();
  }

  @Get("security/control")
  securityControl() {
    return this.control.status();
  }

  @Get("security/identities")
  runtimeIdentities() {
    return this.identities.list();
  }

  @Post("security/authenticate")
  authenticate(@Body() body: { identityId: string; ttlMinutes?: number }) {
    return this.authentication.authenticate(
      body.identityId,
      body.ttlMinutes ?? 15,
    );
  }

  @Get("security/policies")
  policyList() {
    return this.policies.list();
  }

  @Post("security/access/evaluate")
  accessEvaluate(@Body() body: any) {
    return this.zeroTrust.evaluate(body);
  }

  @Get("security/secrets")
  secretList() {
    return this.secrets.list().map((item) => ({
      ...item,
      encryptedValue: "[REDACTED]",
    }));
  }

  @Get("security/encryption")
  encryptionStatus() {
    return this.encryption.list();
  }

  @Get("security/threats")
  threatList() {
    return this.threats.list();
  }

  @Get("security/incidents")
  incidentList() {
    return this.incidents.list();
  }

  @Get("security/audit")
  auditList() {
    return this.audit.list();
  }

  @Post("security/dashboard/run")
  dashboardRun() {
    return this.dashboard.run();
  }

  @Get("security/dashboard/status")
  dashboardStatus() {
    return this.dashboard.latest();
  }

  @Post("verification/run")
  verification() {
    return this.assurance.verification();
  }

  @Post("smoke/run")
  smoke() {
    return this.assurance.smoke();
  }

  @Post("certification/certify")
  certify(@Body() body: { approvedBy: string }) {
    return this.assurance.certify(body.approvedBy);
  }

  @Get("certification/status")
  certificationStatus() {
    return this.assurance.certificationStatus();
  }
}