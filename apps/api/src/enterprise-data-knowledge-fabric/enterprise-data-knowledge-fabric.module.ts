import { Module } from '@nestjs/common';
import { EnterpriseDataKnowledgeFabricController } from './enterprise-data-knowledge-fabric.controller';
import { EnterpriseDataGovernanceEngineService } from './enterprise-data-governance-engine.service';
import { MetadataCatalogIntelligenceService } from './metadata-catalog-intelligence.service';
import { MasterDataManagementCoreService } from './master-data-management-core.service';
import { DataLineageIntelligenceService } from './data-lineage-intelligence.service';
import { DataQualityIntelligenceService } from './data-quality-intelligence.service';
import { KnowledgeFabricEngineService } from './knowledge-fabric-engine.service';
import { EnterpriseSemanticLayerService } from './enterprise-semantic-layer.service';
import { KnowledgeGraphGovernanceService } from './knowledge-graph-governance.service';
import { EnterpriseMemoryVaultService } from './enterprise-memory-vault.service';
import { MemoryRetentionPolicyEngineService } from './memory-retention-policy-engine.service';
import { DataAccessGovernanceService } from './data-access-governance.service';
import { DataSovereigntyIntelligenceService } from './data-sovereignty-intelligence.service';
import { KnowledgeDiscoveryEngineService } from './knowledge-discovery-engine.service';
import { EnterpriseDataKnowledgeOrchestratorService } from './enterprise-data-knowledge-orchestrator.service';
import { DataKnowledgeDashboardService } from './data-knowledge-dashboard.service';

@Module({
  controllers: [EnterpriseDataKnowledgeFabricController],
  providers: [
    EnterpriseDataGovernanceEngineService,
    MetadataCatalogIntelligenceService,
    MasterDataManagementCoreService,
    DataLineageIntelligenceService,
    DataQualityIntelligenceService,
    KnowledgeFabricEngineService,
    EnterpriseSemanticLayerService,
    KnowledgeGraphGovernanceService,
    EnterpriseMemoryVaultService,
    MemoryRetentionPolicyEngineService,
    DataAccessGovernanceService,
    DataSovereigntyIntelligenceService,
    KnowledgeDiscoveryEngineService,
    EnterpriseDataKnowledgeOrchestratorService,
    DataKnowledgeDashboardService,
  ],
  exports: [
    EnterpriseDataGovernanceEngineService,
    MetadataCatalogIntelligenceService,
    MasterDataManagementCoreService,
    DataLineageIntelligenceService,
    DataQualityIntelligenceService,
    KnowledgeFabricEngineService,
    EnterpriseSemanticLayerService,
    KnowledgeGraphGovernanceService,
    EnterpriseMemoryVaultService,
    MemoryRetentionPolicyEngineService,
    DataAccessGovernanceService,
    DataSovereigntyIntelligenceService,
    KnowledgeDiscoveryEngineService,
    EnterpriseDataKnowledgeOrchestratorService,
    DataKnowledgeDashboardService,
  ],
})
export class EnterpriseDataKnowledgeFabricModule {}