import { Module } from "@nestjs/common";
import { AccessDecisionService } from "./access-decision.service";
import { EnterpriseSecurityGovernanceControlPlaneController } from "./enterprise-security-governance-control-plane.controller";
import { EnterpriseSecurityGovernanceControlPlaneService } from "./enterprise-security-governance-control-plane.service";
import { SecretVaultService } from "./secret-vault.service";
import { SecurityCatalogService } from "./security-catalog.service";
import { SecurityDiscoveryService } from "./security-discovery.service";
import { SecurityGovernanceService } from "./security-governance.service";
import { SecurityIncidentService } from "./security-incident.service";
import { SecurityObservabilityService } from "./security-observability.service";
import { SecurityPolicyRegistryService } from "./security-policy-registry.service";
import { SecurityRiskEngineService } from "./security-risk-engine.service";

@Module({
  controllers: [EnterpriseSecurityGovernanceControlPlaneController],
  providers: [
    AccessDecisionService,
    EnterpriseSecurityGovernanceControlPlaneService,
    SecretVaultService,
    SecurityCatalogService,
    SecurityDiscoveryService,
    SecurityGovernanceService,
    SecurityIncidentService,
    SecurityObservabilityService,
    SecurityPolicyRegistryService,
    SecurityRiskEngineService,
  ],
  exports: [
    AccessDecisionService,
    EnterpriseSecurityGovernanceControlPlaneService,
    SecretVaultService,
    SecurityCatalogService,
    SecurityDiscoveryService,
    SecurityGovernanceService,
    SecurityIncidentService,
    SecurityObservabilityService,
    SecurityPolicyRegistryService,
    SecurityRiskEngineService,
  ],
})
export class EnterpriseSecurityGovernanceControlPlaneModule {}
