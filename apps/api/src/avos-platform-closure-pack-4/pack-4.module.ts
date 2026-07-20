import { Module } from '@nestjs/common';
import { CognitiveGovernanceModule } from '../avos-platform-closure-pack-0-5/cognitive-governance.module';
import { Pack1Module } from '../avos-platform-closure-pack-1/pack-1.module';
import { Pack2Module } from '../avos-platform-closure-pack-2/pack-2.module';
import { Pack3Module } from '../avos-platform-closure-pack-3/pack-3.module';
import { DataQualityEngineService } from './data-quality-engine.service';
import { EvidenceRegistryService } from './evidence-registry.service';
import { KnowledgeQueryService } from './knowledge-query.service';
import { Pack4Controller } from './pack-4.controller';
import { Pack4Service } from './pack-4.service';
import { ResearchOrchestratorService } from './research-orchestrator.service';

@Module({
  imports: [
    CognitiveGovernanceModule,
    Pack1Module,
    Pack2Module,
    Pack3Module,
  ],
  controllers: [Pack4Controller],
  providers: [
    DataQualityEngineService,
    EvidenceRegistryService,
    KnowledgeQueryService,
    ResearchOrchestratorService,
    Pack4Service,
  ],
  exports: [
    DataQualityEngineService,
    EvidenceRegistryService,
    KnowledgeQueryService,
    ResearchOrchestratorService,
    Pack4Service,
  ],
})
export class Pack4Module {}