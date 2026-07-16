import { Module } from "@nestjs/common";
import { AuditCenterService } from "./audit-center.service";
import { AuthorizationCenterService } from "./authorization-center.service";
import { CertificateManagerService } from "./certificate-manager.service";
import { EncryptionEngineService } from "./encryption-engine.service";
import { EnterpriseZeroTrustSecurityController } from "./enterprise-zero-trust-security.controller";
import { EnterpriseZeroTrustSecurityService } from "./enterprise-zero-trust-security.service";
import { IdentityRegistryService } from "./identity-registry.service";
import { KeyManagementService } from "./key-management.service";
import { SecretVaultService } from "./secret-vault.service";
import { SecurityAnalyticsService } from "./security-analytics.service";
import { ThreatDetectionService } from "./threat-detection.service";

@Module({
  controllers: [EnterpriseZeroTrustSecurityController],
  providers: [
    AuditCenterService,
    AuthorizationCenterService,
    CertificateManagerService,
    EncryptionEngineService,
    EnterpriseZeroTrustSecurityService,
    IdentityRegistryService,
    KeyManagementService,
    SecretVaultService,
    SecurityAnalyticsService,
    ThreatDetectionService,
  ],
  exports: [
    AuditCenterService,
    AuthorizationCenterService,
    CertificateManagerService,
    EncryptionEngineService,
    EnterpriseZeroTrustSecurityService,
    IdentityRegistryService,
    KeyManagementService,
    SecretVaultService,
    SecurityAnalyticsService,
    ThreatDetectionService,
  ],
})
export class EnterpriseZeroTrustSecurityModule {}
