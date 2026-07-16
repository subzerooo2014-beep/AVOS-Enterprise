import { Injectable } from "@nestjs/common";
import { AccessDecisionService } from "./access-decision.service";
import { SecretVaultService } from "./secret-vault.service";
import { SecurityCatalogService } from "./security-catalog.service";
import { SecurityGovernanceService } from "./security-governance.service";
import { SecurityIncidentService } from "./security-incident.service";
import { SecurityObservabilityService } from "./security-observability.service";
import { SecurityPolicyRegistryService } from "./security-policy-registry.service";
import type {
  SecurityHealth,
  SecurityMetrics,
} from "./enterprise-security-governance-control-plane.types";

@Injectable()
export class EnterpriseSecurityGovernanceControlPlaneService {
  constructor(
    private readonly catalog: SecurityCatalogService,
    private readonly policies: SecurityPolicyRegistryService,
    private readonly decisions: AccessDecisionService,
    private readonly incidents: SecurityIncidentService,
    private readonly secrets: SecretVaultService,
    private readonly observability: SecurityObservabilityService,
    private readonly governance: SecurityGovernanceService,
  ) {}

  metrics(): SecurityMetrics {
    const analytics = this.observability.analytics();

    return {
      components: this.catalog.count(),
      policies: this.policies.count(),
      decisions: analytics.decisions,
      allowed: analytics.allowed,
      denied: analytics.denied,
      reviews: analytics.reviews,
      incidents: analytics.incidents,
      openIncidents: analytics.openIncidents,
      secrets: this.secrets.count(),
    };
  }

  health(): SecurityHealth {
    const governance = this.governance.validate();

    return {
      success: true,
      system: "AVOS Enterprise Security Governance Control Plane",
      version: "1.0.0",
      status: governance.compliant ? "READY" : "DEGRADED",
      metrics: this.metrics(),
      components: {
        discovery: "READY",
        catalog: "READY",
        authenticationIntegration: "INTEGRATION_READY",
        authorizationIntegration: "INTEGRATION_READY",
        rolePermissionIntegration: "INTEGRATION_READY",
        policyRegistry: "READY",
        accessDecisionEngine: "READY",
        riskEngine: "READY",
        secretVault: "READY",
        incidentManagement: "READY",
        observability: "READY",
        governance: governance.compliant ? "READY" : "DEGRADED",
        zeroTrustIntegration: "INTEGRATION_READY",
        complianceIntegration: "INTEGRATION_READY",
      },
    };
  }

  diagnostics() {
    return {
      success: true,
      health: this.health(),
      catalog: this.catalog.status(),
      policies: this.policies.list(),
      decisions: this.decisions.list(),
      incidents: this.incidents.list(),
      secrets: this.secrets.listMetadata(),
      analytics: this.observability.analytics(),
      governance: this.governance.validate(),
    };
  }
}
