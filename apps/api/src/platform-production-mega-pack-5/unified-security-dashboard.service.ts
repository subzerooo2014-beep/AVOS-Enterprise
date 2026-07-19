import { Injectable } from "@nestjs/common";
import { SecurityDashboard } from "./platform-production-mega-pack-5.types";
import { RuntimeIdentityService } from "./runtime-identity.service";
import { ServiceAuthenticationService } from "./service-authentication.service";
import { AuthorizationPoliciesService } from "./authorization-policies.service";
import { SecretsManagementService } from "./secrets-management.service";
import { EncryptionControlService } from "./encryption-control.service";
import { ThreatDetectionService } from "./threat-detection.service";
import { SecurityIncidentIntegrationService } from "./security-incident-integration.service";
import { PlatformSecurityFileStoreService } from "./platform-security-file-store.service";

@Injectable()
export class UnifiedSecurityDashboardService {
  constructor(
    private readonly store: PlatformSecurityFileStoreService,
    private readonly identities: RuntimeIdentityService,
    private readonly authentication: ServiceAuthenticationService,
    private readonly policies: AuthorizationPoliciesService,
    private readonly secrets: SecretsManagementService,
    private readonly encryption: EncryptionControlService,
    private readonly threats: ThreatDetectionService,
    private readonly incidents: SecurityIncidentIntegrationService,
  ) {}

  private now(): string {
    return new Date().toISOString();
  }

  private id(prefix: string): string {
    return `${prefix}:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`;
  }

  run(): SecurityDashboard {
    const activeIdentities = this.identities
      .list()
      .filter((item) => item.status === "active").length;
    const activeSessions = this.authentication
      .list()
      .filter(
        (item) =>
          item.status === "active" &&
          new Date(item.expiresAt).getTime() > Date.now(),
      ).length;
    const activePolicies = this.policies
      .list()
      .filter((item) => item.active).length;
    const activeSecrets = this.secrets
      .list()
      .filter((item) => item.active).length;
    const activeEncryptionKeys = this.encryption
      .list()
      .filter((item) => item.status === "active").length;
    const openThreats = this.threats
      .list()
      .filter((item) => item.status === "open").length;
    const criticalThreats = this.threats
      .list()
      .filter(
        (item) =>
          item.status === "open" &&
          item.severity === "critical",
      ).length;
    const openIncidents = this.incidents
      .list()
      .filter((item) => item.status !== "resolved").length;

    const blockingIssues: string[] = [];

    if (activeIdentities < 3) {
      blockingIssues.push("Required runtime identities are missing.");
    }

    if (activePolicies < 4) {
      blockingIssues.push("Authorization policy baseline is incomplete.");
    }

    if (activeSecrets < 1) {
      blockingIssues.push("Secrets management has no active secret.");
    }

    if (activeEncryptionKeys < 1) {
      blockingIssues.push("Encryption control has no active key.");
    }

    if (criticalThreats > 0) {
      blockingIssues.push("Critical threats remain open.");
    }

    const score = Math.max(
      0,
      100 -
        blockingIssues.length * 20 -
        openThreats * 3 -
        openIncidents * 5,
    );

    const dashboard: SecurityDashboard = {
      id: this.id("security-dashboard"),
      score,
      state:
        score >= 90 && blockingIssues.length === 0
          ? "healthy"
          : score >= 60
            ? "degraded"
            : "critical",
      activeIdentities,
      activeSessions,
      activePolicies,
      activeSecrets,
      activeEncryptionKeys,
      openThreats,
      criticalThreats,
      openIncidents,
      blockingIssues,
      createdAt: this.now(),
    };

    this.store.writeJson("dashboard/latest.json", dashboard);
    return dashboard;
  }

  latest(): SecurityDashboard | null {
    return this.store.readJson<SecurityDashboard | null>(
      "dashboard/latest.json",
      null,
    );
  }
}