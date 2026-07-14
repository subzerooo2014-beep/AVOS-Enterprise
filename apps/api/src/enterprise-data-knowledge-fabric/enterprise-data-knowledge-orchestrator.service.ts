import { Injectable } from '@nestjs/common';
import {
  DataAsset,
  DataLineageEdge,
  KnowledgeEntity,
  KnowledgeRelation,
  MemoryVaultEntry,
  MetadataEntry,
} from './enterprise-data-knowledge-fabric.types';
import { EnterpriseDataGovernanceEngineService } from './enterprise-data-governance-engine.service';
import { MetadataCatalogIntelligenceService } from './metadata-catalog-intelligence.service';
import { DataLineageIntelligenceService } from './data-lineage-intelligence.service';
import { DataQualityIntelligenceService } from './data-quality-intelligence.service';
import { KnowledgeFabricEngineService } from './knowledge-fabric-engine.service';
import { EnterpriseSemanticLayerService } from './enterprise-semantic-layer.service';
import { KnowledgeGraphGovernanceService } from './knowledge-graph-governance.service';
import { EnterpriseMemoryVaultService } from './enterprise-memory-vault.service';
import { KnowledgeDiscoveryEngineService } from './knowledge-discovery-engine.service';

@Injectable()
export class EnterpriseDataKnowledgeOrchestratorService {
  constructor(
    private readonly governance: EnterpriseDataGovernanceEngineService,
    private readonly metadata: MetadataCatalogIntelligenceService,
    private readonly lineage: DataLineageIntelligenceService,
    private readonly quality: DataQualityIntelligenceService,
    private readonly fabric: KnowledgeFabricEngineService,
    private readonly semantic: EnterpriseSemanticLayerService,
    private readonly graphGovernance: KnowledgeGraphGovernanceService,
    private readonly vault: EnterpriseMemoryVaultService,
    private readonly discovery: KnowledgeDiscoveryEngineService,
  ) {}

  run(input: {
    assets: DataAsset[];
    metadata: MetadataEntry[];
    lineage: DataLineageEdge[];
    entities: KnowledgeEntity[];
    relations: KnowledgeRelation[];
    memoryEntries: MemoryVaultEntry[];
  }) {
    for (const entry of input.memoryEntries) {
      this.vault.store(entry);
    }

    return {
      governance: this.governance.evaluate(input.assets),
      metadata: this.metadata.catalog(input.assets, input.metadata),
      lineage: this.lineage.analyze(input.assets, input.lineage),
      quality: this.quality.analyze(input.assets),
      fabric: this.fabric.build(input.entities, input.relations),
      semantic: this.semantic.map(input.entities),
      graphGovernance: this.graphGovernance.govern(
        input.entities,
        input.relations,
      ),
      memoryVault: this.vault.health(),
      discovery: this.discovery.discover(
        input.entities,
        input.relations,
      ),
    };
  }
}