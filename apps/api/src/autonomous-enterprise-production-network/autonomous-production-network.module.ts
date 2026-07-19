import { Module } from '@nestjs/common';
import { EnterpriseFactoryModule } from '../enterprise-factory/enterprise-factory.module';
import { ProductionEvolutionModule } from '../enterprise-factory-production-evolution/production-evolution.module';
import { AutonomousNetworkFinalCertificationService } from './autonomous-network-final-certification.service';
import { AutonomousNetworkIntelligenceService } from './autonomous-network-intelligence.service';
import { AutonomousProductionNetworkController } from './autonomous-production-network.controller';
import { AutonomousProductionNetworkStore } from './autonomous-production-network.store';
import { AutonomousRoutingEngineService } from './autonomous-routing-engine.service';
import { NetworkCoordinationOrchestratorService } from './network-coordination-orchestrator.service';
import { NetworkGovernanceAuthorityService } from './network-governance-authority.service';
import { NetworkNodeRegistryService } from './network-node-registry.service';
import { NetworkResilienceEngineService } from './network-resilience-engine.service';

@Module({
  imports: [EnterpriseFactoryModule, ProductionEvolutionModule],
  controllers: [AutonomousProductionNetworkController],
  providers: [
    AutonomousProductionNetworkStore,
    NetworkNodeRegistryService,
    AutonomousRoutingEngineService,
    NetworkCoordinationOrchestratorService,
    NetworkResilienceEngineService,
    NetworkGovernanceAuthorityService,
    AutonomousNetworkIntelligenceService,
    AutonomousNetworkFinalCertificationService,
  ],
  exports: [
    AutonomousProductionNetworkStore,
    NetworkNodeRegistryService,
    AutonomousRoutingEngineService,
    NetworkCoordinationOrchestratorService,
    NetworkResilienceEngineService,
    NetworkGovernanceAuthorityService,
    AutonomousNetworkIntelligenceService,
    AutonomousNetworkFinalCertificationService,
  ],
})
export class AutonomousProductionNetworkModule {}
