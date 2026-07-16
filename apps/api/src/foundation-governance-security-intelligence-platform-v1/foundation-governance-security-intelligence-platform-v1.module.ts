import { Module } from "@nestjs/common";
import { FoundationAuditIntegrityV1Service } from "./foundation-audit-integrity-v1.service";
import { FoundationDataGovernanceV1Service } from "./foundation-data-governance-v1.service";
import { FoundationDataQualityV1Service } from "./foundation-data-quality-v1.service";
import { FoundationDigitalTwinV1Service } from "./foundation-digital-twin-v1.service";
import { FoundationEnterpriseMemoryV1Service } from "./foundation-enterprise-memory-v1.service";
import { FoundationEvolutionEngineV1Service } from "./foundation-evolution-engine-v1.service";
import { FoundationGovernanceSecurityIntelligencePlatformV1Controller } from "./foundation-governance-security-intelligence-platform-v1.controller";
import { FoundationGovernanceSecurityIntelligencePlatformV1Service } from "./foundation-governance-security-intelligence-platform-v1.service";
import { FoundationHighAvailabilityV1Service } from "./foundation-high-availability-v1.service";
import { FoundationIntegrationsV1Service } from "./foundation-integrations-v1.service";
import { FoundationKnowledgeGraphV1Service } from "./foundation-knowledge-graph-v1.service";
import { FoundationSecurityThreatV1Service } from "./foundation-security-threat-v1.service";
import { FoundationUpdateOsV1Service } from "./foundation-update-os-v1.service";

@Module({
  controllers: [FoundationGovernanceSecurityIntelligencePlatformV1Controller],
  providers: [
    FoundationAuditIntegrityV1Service,
    FoundationDataGovernanceV1Service,
    FoundationDataQualityV1Service,
    FoundationDigitalTwinV1Service,
    FoundationEnterpriseMemoryV1Service,
    FoundationEvolutionEngineV1Service,
    FoundationGovernanceSecurityIntelligencePlatformV1Service,
    FoundationHighAvailabilityV1Service,
    FoundationIntegrationsV1Service,
    FoundationKnowledgeGraphV1Service,
    FoundationSecurityThreatV1Service,
    FoundationUpdateOsV1Service,
  ],
  exports: [
    FoundationAuditIntegrityV1Service,
    FoundationDataGovernanceV1Service,
    FoundationDataQualityV1Service,
    FoundationDigitalTwinV1Service,
    FoundationEnterpriseMemoryV1Service,
    FoundationEvolutionEngineV1Service,
    FoundationGovernanceSecurityIntelligencePlatformV1Service,
    FoundationHighAvailabilityV1Service,
    FoundationIntegrationsV1Service,
    FoundationKnowledgeGraphV1Service,
    FoundationSecurityThreatV1Service,
    FoundationUpdateOsV1Service,
  ],
})
export class FoundationGovernanceSecurityIntelligencePlatformV1Module {}
