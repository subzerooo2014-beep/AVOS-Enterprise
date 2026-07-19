import { Module } from "@nestjs/common";
import { PlatformSecurityFileStoreService } from "./platform-security-file-store.service";
import { SecurityAuditService } from "./security-audit.service";
import { RuntimeIdentityService } from "./runtime-identity.service";
import { EncryptionControlService } from "./encryption-control.service";
import { ServiceAuthenticationService } from "./service-authentication.service";
import { AuthorizationPoliciesService } from "./authorization-policies.service";
import { SecretsManagementService } from "./secrets-management.service";
import { ZeroTrustServiceAccessService } from "./zero-trust-service-access.service";
import { ThreatDetectionService } from "./threat-detection.service";
import { SecurityIncidentIntegrationService } from "./security-incident-integration.service";
import { PlatformSecurityControlService } from "./platform-security-control.service";
import { UnifiedSecurityDashboardService } from "./unified-security-dashboard.service";
import { PlatformProductionMegaPack5StatusService } from "./platform-production-mega-pack-5-status.service";
import { PlatformProductionMegaPack5AssuranceService } from "./platform-production-mega-pack-5-assurance.service";
import { PlatformProductionMegaPack5Controller } from "./platform-production-mega-pack-5.controller";

@Module({
  controllers: [PlatformProductionMegaPack5Controller],
  providers: [
    PlatformSecurityFileStoreService,
    SecurityAuditService,
    RuntimeIdentityService,
    EncryptionControlService,
    ServiceAuthenticationService,
    AuthorizationPoliciesService,
    SecretsManagementService,
    ZeroTrustServiceAccessService,
    ThreatDetectionService,
    SecurityIncidentIntegrationService,
    PlatformSecurityControlService,
    UnifiedSecurityDashboardService,
    PlatformProductionMegaPack5StatusService,
    PlatformProductionMegaPack5AssuranceService,
  ],
  exports: [
    RuntimeIdentityService,
    ServiceAuthenticationService,
    AuthorizationPoliciesService,
    SecretsManagementService,
    EncryptionControlService,
    ZeroTrustServiceAccessService,
    ThreatDetectionService,
    SecurityIncidentIntegrationService,
    PlatformSecurityControlService,
    UnifiedSecurityDashboardService,
  ],
})
export class PlatformProductionMegaPack5Module {}