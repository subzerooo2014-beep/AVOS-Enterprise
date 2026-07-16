import { Injectable } from "@nestjs/common";
import { FoundationAuditIntegrityV1Service } from "./foundation-audit-integrity-v1.service";
import { FoundationDataGovernanceV1Service } from "./foundation-data-governance-v1.service";
import { FoundationDataQualityV1Service } from "./foundation-data-quality-v1.service";
import { FoundationDigitalTwinV1Service } from "./foundation-digital-twin-v1.service";
import { FoundationEnterpriseMemoryV1Service } from "./foundation-enterprise-memory-v1.service";
import { FoundationEvolutionEngineV1Service } from "./foundation-evolution-engine-v1.service";
import { FoundationHighAvailabilityV1Service } from "./foundation-high-availability-v1.service";
import { FoundationIntegrationsV1Service } from "./foundation-integrations-v1.service";
import { FoundationKnowledgeGraphV1Service } from "./foundation-knowledge-graph-v1.service";
import { FoundationSecurityThreatV1Service } from "./foundation-security-threat-v1.service";
import { FoundationUpdateOsV1Service } from "./foundation-update-os-v1.service";
import type {
  FoundationFinalMetricsV1,
  FoundationFinalStatusV1,
} from "./foundation-governance-security-intelligence-v1.types";

@Injectable()
export class FoundationGovernanceSecurityIntelligencePlatformV1Service {
  constructor(
    private readonly integrations: FoundationIntegrationsV1Service,
    private readonly governance: FoundationDataGovernanceV1Service,
    private readonly quality: FoundationDataQualityV1Service,
    private readonly audit: FoundationAuditIntegrityV1Service,
    private readonly security: FoundationSecurityThreatV1Service,
    private readonly ha: FoundationHighAvailabilityV1Service,
    private readonly updates: FoundationUpdateOsV1Service,
    private readonly evolution: FoundationEvolutionEngineV1Service,
    private readonly memory: FoundationEnterpriseMemoryV1Service,
    private readonly knowledge: FoundationKnowledgeGraphV1Service,
    private readonly twins: FoundationDigitalTwinV1Service,
  ) {}

  metrics(): FoundationFinalMetricsV1 {
    return {
      integrations: this.integrations.count(),
      governancePolicies: this.governance.count(),
      qualityRules: this.quality.count(),
      auditRecords: this.audit.count(),
      securityFindings: this.security.count(),
      criticalFindings: this.security.criticalCount(),
      haNodes: this.ha.count(),
      healthyNodes: this.ha.healthyCount(),
      releases: this.updates.count(),
      evolutionProposals: this.evolution.count(),
      memoryRecords: this.memory.count(),
      knowledgeEntities: this.knowledge.entityCount(),
      knowledgeRelations: this.knowledge.relationCount(),
      digitalTwins: this.twins.count(),
    };
  }

  status(): FoundationFinalStatusV1 {
    const metrics = this.metrics();
    const auditHealthy = this.audit.verifyChain();

    return {
      success: true,
      system: "AVOS Foundation Governance, Security & Intelligence Platform V1",
      version: "1.0.0",
      status:
        metrics.criticalFindings > 0 || !auditHealthy
          ? "DEGRADED"
          : "READY",
      metrics,
      components: {
        integrationsApiWebhooksSdk: "READY",
        dataGovernance: "READY",
        dataQuality: "READY",
        auditComplianceIntegrity: auditHealthy ? "READY" : "DEGRADED",
        cybersecurityThreatDetection: "READY",
        scalabilityHighAvailability: "READY",
        updateOs: "READY",
        evolutionEngine: "READY",
        enterpriseMemoryCore: "READY",
        knowledgeGraphFoundation: "READY",
        digitalTwinFoundation: "READY",
      },
    };
  }

  diagnostics() {
    return {
      success: true,
      status: this.status(),
      integrations: this.integrations.list(),
      governancePolicies: this.governance.list(),
      qualityRules: this.quality.list(),
      auditRecords: this.audit.list(),
      securityFindings: this.security.list(),
      haNodes: this.ha.list(),
      releases: this.updates.list(),
      evolutionProposals: this.evolution.list(),
      memory: this.memory.list(),
      knowledgeEntities: this.knowledge.listEntities(),
      knowledgeRelations: this.knowledge.listRelations(),
      digitalTwins: this.twins.list(),
    };
  }
}
