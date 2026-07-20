import { Module } from '@nestjs/common';
import { ArchitectureHealthService } from './architecture-health.service';
import { ArchitectureInventoryService } from './architecture-inventory.service';
import { ConsolidationEngineService } from './consolidation-engine.service';
import { DependencyIntelligenceService } from './dependency-intelligence.service';
import { DuplicateAnalysisService } from './duplicate-analysis.service';
import { PlatformClosurePack0Controller } from './platform-closure-pack-0.controller';
import { PlatformClosurePack0Service } from './platform-closure-pack-0.service';
import { StrategicGapService } from './strategic-gap.service';

@Module({
  controllers: [PlatformClosurePack0Controller],
  providers: [
    ArchitectureInventoryService,
    DuplicateAnalysisService,
    DependencyIntelligenceService,
    ArchitectureHealthService,
    ConsolidationEngineService,
    StrategicGapService,
    PlatformClosurePack0Service,
  ],
  exports: [PlatformClosurePack0Service],
})
export class PlatformClosurePack0Module {}