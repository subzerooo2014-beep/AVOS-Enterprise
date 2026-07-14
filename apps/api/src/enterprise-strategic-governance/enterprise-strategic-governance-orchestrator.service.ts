import { Injectable } from '@nestjs/common';
import {
  EnterpriseKpi,
  EnterpriseObjective,
  PortfolioInitiative,
  StrategicRisk,
  StrategyScenario,
} from './enterprise-strategic-governance.types';
import { AutonomousStrategyEngineService } from './autonomous-strategy-engine.service';
import { EnterpriseObjectiveManagementService } from './enterprise-objective-management.service';
import { PortfolioGovernanceEngineService } from './portfolio-governance-engine.service';
import { StrategicRiskIntelligenceService } from './strategic-risk-intelligence.service';
import { EnterpriseKpiIntelligenceService } from './enterprise-kpi-intelligence.service';
import { StrategySimulationEngineService } from './strategy-simulation-engine.service';
import { ExecutiveGovernanceCenterService } from './executive-governance-center.service';
import { EnterpriseDecisionAuditService } from './enterprise-decision-audit.service';

@Injectable()
export class EnterpriseStrategicGovernanceOrchestratorService {
  constructor(
    private readonly strategy: AutonomousStrategyEngineService,
    private readonly objectives: EnterpriseObjectiveManagementService,
    private readonly portfolio: PortfolioGovernanceEngineService,
    private readonly risk: StrategicRiskIntelligenceService,
    private readonly kpi: EnterpriseKpiIntelligenceService,
    private readonly simulation: StrategySimulationEngineService,
    private readonly governance: ExecutiveGovernanceCenterService,
    private readonly audit: EnterpriseDecisionAuditService,
  ) {}

  run(input: {
    strategyName: string;
    objectives: EnterpriseObjective[];
    initiatives: PortfolioInitiative[];
    risks: StrategicRisk[];
    kpis: EnterpriseKpi[];
    scenarios: StrategyScenario[];
    constraints?: string[];
  }) {
    const strategy = this.strategy.evaluate(
      input.strategyName,
      input.objectives,
      input.constraints,
    );
    const objectiveCompletion = this.objectives.portfolioProgress(
      input.objectives,
    );
    const rankedPortfolio = this.portfolio.rank(input.initiatives);
    const risk = this.risk.assess(input.risks);
    const kpi = this.kpi.analyze(input.kpis);
    const simulation = this.simulation.simulate(input.scenarios);
    const decision = this.governance.decide(
      input.strategyName,
      strategy.score,
      risk.criticalRisks,
    );
    const audit = this.audit.record(
      decision.id,
      'enterprise-strategic-governance-orchestrator',
      decision.outcome,
      {
        strategyScore: strategy.score,
        objectiveCompletion,
        kpiHealth: kpi.health,
      },
    );

    return {
      strategy,
      objectiveCompletion,
      rankedPortfolio,
      risk,
      kpi,
      simulation,
      decision,
      audit,
    };
  }
}