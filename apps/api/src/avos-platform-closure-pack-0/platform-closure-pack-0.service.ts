import { Injectable } from '@nestjs/common';
import { ArchitectureHealthService } from './architecture-health.service';
import { ArchitectureInventoryService } from './architecture-inventory.service';
import { ConsolidationEngineService } from './consolidation-engine.service';
import { DependencyIntelligenceService } from './dependency-intelligence.service';
import { DuplicateAnalysisService } from './duplicate-analysis.service';
import {
  ArchitectureInventory,
  FullScanResult,
} from './platform-closure-pack-0.types';
import { StrategicGapService } from './strategic-gap.service';

@Injectable()
export class PlatformClosurePack0Service {
  private latest?: FullScanResult;

  constructor(
    private readonly inventoryService: ArchitectureInventoryService,
    private readonly duplicateService: DuplicateAnalysisService,
    private readonly dependencyService: DependencyIntelligenceService,
    private readonly healthService: ArchitectureHealthService,
    private readonly consolidationService: ConsolidationEngineService,
    private readonly gapService: StrategicGapService,
  ) {}

  status() {
    return {
      name: 'AVOS Intelligent Autonomous Platform Closure — Pack 0',
      version: 'PC-P0-1.0.0',
      status: 'operational',
      phase: 'Architecture Inventory & Consolidation',
      scanCompleted: Boolean(this.latest),
      lastScanAt: this.latest?.generatedAt ?? null,
      rules: {
        noLearningBeforeCognitiveGovernance: true,
        noMultiAgentBeforeOrganizationOSAndAICouncil: true,
        livingVisionRequired: true,
        collaborativeAgentTeams: true,
        dynamicTeamFormation: true,
        crossProjectKnowledgeSharing: true,
        projectRetrospectiveRequired: true,
        humanFinalAuthority: true,
        humanApprovalGate: true,
        noDuplicatesBeforeInventoryReview: true,
      },
    };
  }

  async fullScan(root?: string): Promise<FullScanResult> {
    const inventory = await this.inventoryService.scan(root);
    const duplicates = this.duplicateService.analyze(inventory);
    const dependencies = this.dependencyService.analyze(inventory);
    const health = this.healthService.calculate(inventory, duplicates, dependencies);
    const consolidation = this.consolidationService.recommend(
      duplicates,
      dependencies,
    );
    const gaps = this.gapService.analyze(inventory);

    this.latest = {
      pack: 'AVOS Platform Closure Pack 0',
      version: 'PC-P0-1.0.0',
      status: 'completed',
      generatedAt: new Date().toISOString(),
      inventory,
      duplicates,
      dependencies,
      health,
      consolidation,
      gaps,
      governance: {
        noNewComponentsBeforeInventoryReview: true,
        humanFinalAuthority: true,
        humanApprovalGate: true,
        livingVisionRequired: true,
        projectRetrospectiveRequired: true,
      },
    };

    return this.latest;
  }

  async inventory(): Promise<ArchitectureInventory> {
    return this.ensureScan().then((result) => result.inventory);
  }

  async capabilities() {
    const inventory = await this.inventory();
    return {
      generatedAt: inventory.generatedAt,
      total: inventory.totalComponents,
      byKind: inventory.byKind,
      capabilities: inventory.components.filter((component) =>
        ['engine', 'service', 'runtime', 'fabric', 'foundation', 'registry'].includes(
          component.kind,
        ),
      ),
    };
  }

  async dependencies() {
    return this.ensureScan().then((result) => result.dependencies);
  }

  async duplicates() {
    return this.ensureScan().then((result) => result.duplicates);
  }

  async health() {
    return this.ensureScan().then((result) => result.health);
  }

  async consolidation() {
    return this.ensureScan().then((result) => result.consolidation);
  }

  async gaps() {
    return this.ensureScan().then((result) => result.gaps);
  }

  private async ensureScan(): Promise<FullScanResult> {
    return this.latest ?? this.fullScan();
  }
}