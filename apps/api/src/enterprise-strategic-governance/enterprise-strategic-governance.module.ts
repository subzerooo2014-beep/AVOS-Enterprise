import { Module } from '@nestjs/common';
import { EnterpriseStrategicGovernanceController } from './enterprise-strategic-governance.controller';
import { AutonomousStrategyEngineService } from './autonomous-strategy-engine.service';
import { EnterpriseObjectiveManagementService } from './enterprise-objective-management.service';
import { PortfolioGovernanceEngineService } from './portfolio-governance-engine.service';
import { StrategicRiskIntelligenceService } from './strategic-risk-intelligence.service';
import { EnterpriseKpiIntelligenceService } from './enterprise-kpi-intelligence.service';
import { AutonomousOkrEngineService } from './autonomous-okr-engine.service';
import { ExecutiveGovernanceCenterService } from './executive-governance-center.service';
import { EnterpriseDecisionAuditService } from './enterprise-decision-audit.service';
import { StrategySimulationEngineService } from './strategy-simulation-engine.service';
import { EnterpriseStrategicGovernanceOrchestratorService } from './enterprise-strategic-governance-orchestrator.service';
import { StrategicIntelligenceDashboardService } from './strategic-intelligence-dashboard.service';

@Module({
  controllers: [EnterpriseStrategicGovernanceController],
  providers: [
    AutonomousStrategyEngineService,
    EnterpriseObjectiveManagementService,
    PortfolioGovernanceEngineService,
    StrategicRiskIntelligenceService,
    EnterpriseKpiIntelligenceService,
    AutonomousOkrEngineService,
    ExecutiveGovernanceCenterService,
    EnterpriseDecisionAuditService,
    StrategySimulationEngineService,
    EnterpriseStrategicGovernanceOrchestratorService,
    StrategicIntelligenceDashboardService,
  ],
  exports: [
    AutonomousStrategyEngineService,
    EnterpriseObjectiveManagementService,
    PortfolioGovernanceEngineService,
    StrategicRiskIntelligenceService,
    EnterpriseKpiIntelligenceService,
    AutonomousOkrEngineService,
    ExecutiveGovernanceCenterService,
    EnterpriseDecisionAuditService,
    StrategySimulationEngineService,
    EnterpriseStrategicGovernanceOrchestratorService,
    StrategicIntelligenceDashboardService,
  ],
})
export class EnterpriseStrategicGovernanceModule {}