import { Body, Controller, Get, Post } from '@nestjs/common';
import { DataGovernanceDto } from './dto/data-governance.dto';
import { KnowledgeGraphDto } from './dto/knowledge-graph.dto';
import { MemoryVaultDto } from './dto/memory-vault.dto';
import { EnterpriseDataGovernanceEngineService } from './enterprise-data-governance-engine.service';
import { KnowledgeFabricEngineService } from './knowledge-fabric-engine.service';
import { EnterpriseMemoryVaultService } from './enterprise-memory-vault.service';
import { DataKnowledgeDashboardService } from './data-knowledge-dashboard.service';
import { ENTERPRISE_DATA_KNOWLEDGE_FABRIC_CAPABILITIES } from './enterprise-data-knowledge-fabric.types';

@Controller('enterprise-data-knowledge-fabric')
export class EnterpriseDataKnowledgeFabricController {
  constructor(
    private readonly governance: EnterpriseDataGovernanceEngineService,
    private readonly fabric: KnowledgeFabricEngineService,
    private readonly vault: EnterpriseMemoryVaultService,
    private readonly dashboard: DataKnowledgeDashboardService,
  ) {}

  @Get('capabilities')
  capabilities() {
    return {
      bundle:
        'Ultra Bundle O — Data Governance, Knowledge Fabric & Enterprise Memory Completion',
      count: ENTERPRISE_DATA_KNOWLEDGE_FABRIC_CAPABILITIES.length,
      capabilities: ENTERPRISE_DATA_KNOWLEDGE_FABRIC_CAPABILITIES,
    };
  }

  @Post('governance/evaluate')
  evaluateGovernance(@Body() input: DataGovernanceDto) {
    return this.governance.evaluate(input.assets);
  }

  @Post('knowledge/build')
  buildKnowledge(@Body() input: KnowledgeGraphDto) {
    return this.fabric.build(input.entities, input.relations);
  }

  @Post('memory/store')
  storeMemory(@Body() input: MemoryVaultDto) {
    return {
      stored: input.entries.map((entry) => this.vault.store(entry)),
      health: this.vault.health(),
    };
  }

  @Get('dashboard')
  dashboardSnapshot() {
    return this.dashboard.snapshot();
  }
}