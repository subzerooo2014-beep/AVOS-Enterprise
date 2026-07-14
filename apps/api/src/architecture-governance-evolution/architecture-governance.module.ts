import { Module } from '@nestjs/common';
import { ArchitectureGovernanceController } from './architecture-governance.controller';
import { ArchitectureGenomeService } from './architecture-genome.service';
import { AdaptiveArchitectureKernelService } from './adaptive-architecture-kernel.service';
import { ArchitectureSynthesisService } from './architecture-synthesis.service';
import { AutonomousTechnicalDebtManagerService } from './technical-debt-manager.service';
import { EnterprisePrincipleEngineService } from './enterprise-principle-engine.service';
import { PolicyNegotiationEngineService } from './policy-negotiation.service';
import { AutonomousConstitutionalEvolutionService } from './constitutional-evolution.service';
import { GovernanceEvolutionService } from './governance-evolution.service';
import { ContinuousArchitectureEvolutionService } from './architecture-evolution.service';
import { SelfDesigningArchitectureService } from './self-designing-architecture.service';
import { ArchitectureIntelligenceDashboardService } from './architecture-intelligence-dashboard.service';

@Module({
  controllers: [ArchitectureGovernanceController],
  providers: [
    ArchitectureGenomeService,
    AdaptiveArchitectureKernelService,
    ArchitectureSynthesisService,
    AutonomousTechnicalDebtManagerService,
    EnterprisePrincipleEngineService,
    PolicyNegotiationEngineService,
    AutonomousConstitutionalEvolutionService,
    GovernanceEvolutionService,
    ContinuousArchitectureEvolutionService,
    SelfDesigningArchitectureService,
    ArchitectureIntelligenceDashboardService,
  ],
  exports: [
    ArchitectureGenomeService,
    AdaptiveArchitectureKernelService,
    ArchitectureSynthesisService,
    AutonomousTechnicalDebtManagerService,
    GovernanceEvolutionService,
    ContinuousArchitectureEvolutionService,
    SelfDesigningArchitectureService,
    ArchitectureIntelligenceDashboardService,
  ],
})
export class ArchitectureGovernanceModule {}