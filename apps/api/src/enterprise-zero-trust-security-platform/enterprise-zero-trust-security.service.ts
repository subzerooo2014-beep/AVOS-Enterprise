import { Injectable } from "@nestjs/common";
import { AuditCenterService } from "./audit-center.service";
import { AuthorizationCenterService } from "./authorization-center.service";
import { CertificateManagerService } from "./certificate-manager.service";
import { IdentityRegistryService } from "./identity-registry.service";
import { KeyManagementService } from "./key-management.service";
import { SecretVaultService } from "./secret-vault.service";
import { SecurityAnalyticsService } from "./security-analytics.service";
import { ThreatDetectionService } from "./threat-detection.service";
import type { ZeroTrustHealth, ZeroTrustMetrics } from "./zero-trust-security.types";

@Injectable()
export class EnterpriseZeroTrustSecurityService {
  constructor(
    private readonly identities: IdentityRegistryService,
    private readonly authorization: AuthorizationCenterService,
    private readonly secrets: SecretVaultService,
    private readonly keys: KeyManagementService,
    private readonly certificates: CertificateManagerService,
    private readonly audits: AuditCenterService,
    private readonly threats: ThreatDetectionService,
    private readonly analytics: SecurityAnalyticsService,
  ) {}

  metrics(): ZeroTrustMetrics {
    const analytics = this.analytics.snapshot();

    return {
      identities: this.identities.count(),
      policies: this.authorization.policyCount(),
      decisions: analytics.decisions,
      deniedDecisions: analytics.denied,
      secrets: this.secrets.count(),
      keys: this.keys.count(),
      certificates: this.certificates.count(),
      audits: analytics.audits,
      threats: analytics.threats,
      openThreats: analytics.openThreats,
    };
  }

  health(): ZeroTrustHealth {
    const metrics = this.metrics();

    return {
      success: true,
      system: "AVOS Enterprise Zero Trust Security Platform",
      version: "1.0.0",
      status:
        metrics.openThreats > 0 || metrics.deniedDecisions > 0
          ? "DEGRADED"
          : "READY",
      metrics,
      components: {
        identityRegistry: "READY",
        authorizationCenter: "READY",
        secretVault: "READY",
        keyManagement: "READY",
        encryptionEngine: "READY",
        certificateManager: "READY",
        auditCenter: "READY",
        threatDetection: "READY",
        securityAnalytics: "READY",
        zeroTrustDecisioning: "READY",
      },
    };
  }

  diagnostics() {
    return {
      success: true,
      health: this.health(),
      identities: this.identities.list(),
      policies: this.authorization.policiesList(),
      decisions: this.authorization.decisionsList(),
      secrets: this.secrets.metadata(),
      keys: this.keys.list(),
      certificates: this.certificates.list(),
      audits: this.audits.list(),
      threats: this.threats.list(),
      analytics: this.analytics.snapshot(),
    };
  }
}
