import { Injectable } from "@nestjs/common";
import { PlatformSecurityControlService } from "./platform-security-control.service";
import { UnifiedSecurityDashboardService } from "./unified-security-dashboard.service";

@Injectable()
export class PlatformProductionMegaPack5StatusService {
  constructor(
    private readonly control: PlatformSecurityControlService,
    private readonly dashboard: UnifiedSecurityDashboardService,
  ) {}

  status(): Record<string, unknown> {
    return {
      name: "AVOS Platform Production Integration — Mega Pack 5",
      version: "PPI-MP5-1.0.0",
      status: "operational",
      foundationFirst: true,
      capabilityFirst: true,
      blueprintDriven: true,
      humanFinalAuthority: true,
      globalComplianceReadinessGate: true,
      components: {
        platformSecurityControl: true,
        zeroTrustServiceAccess: true,
        runtimeIdentity: true,
        serviceAuthentication: true,
        authorizationPolicies: true,
        secretsManagement: true,
        encryptionControl: true,
        threatDetection: true,
        securityIncidentIntegration: true,
        unifiedSecurityDashboard: true,
      },
      metrics: this.control.status(),
      latestDashboard: this.dashboard.latest(),
    };
  }
}