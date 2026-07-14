import { Body, Controller, Get, Post } from '@nestjs/common';
import { StrategyEvaluationDto } from './dto/strategy-evaluation.dto';
import { PortfolioGovernanceDto } from './dto/portfolio-governance.dto';
import { StrategySimulationDto } from './dto/strategy-simulation.dto';
import { AutonomousStrategyEngineService } from './autonomous-strategy-engine.service';
import { PortfolioGovernanceEngineService } from './portfolio-governance-engine.service';
import { StrategySimulationEngineService } from './strategy-simulation-engine.service';
import { StrategicIntelligenceDashboardService } from './strategic-intelligence-dashboard.service';
import { ENTERPRISE_STRATEGIC_GOVERNANCE_CAPABILITIES } from './enterprise-strategic-governance.types';

@Controller('enterprise-strategic-governance')
export class EnterpriseStrategicGovernanceController {
  constructor(
    private readonly strategy: AutonomousStrategyEngineService,
    private readonly portfolio: PortfolioGovernanceEngineService,
    private readonly simulation: StrategySimulationEngineService,
    private readonly dashboard: StrategicIntelligenceDashboardService,
  ) {}

  @Get('capabilities')
  capabilities() {
    return {
      bundle: 'Ultra Bundle F — Enterprise Autonomy & Strategic Governance',
      count: ENTERPRISE_STRATEGIC_GOVERNANCE_CAPABILITIES.length,
      capabilities: ENTERPRISE_STRATEGIC_GOVERNANCE_CAPABILITIES,
    };
  }

  @Post('strategy/evaluate')
  evaluateStrategy(@Body() input: StrategyEvaluationDto) {
    return this.strategy.evaluate(
      input.strategyName,
      input.objectives.map((objective) => ({
        ...objective,
        status: 'draft',
      })),
      input.constraints,
    );
  }

  @Post('portfolio/rank')
  rankPortfolio(@Body() input: PortfolioGovernanceDto) {
    return this.portfolio.rank(input.initiatives);
  }

  @Post('simulation/run')
  runSimulation(@Body() input: StrategySimulationDto) {
    return this.simulation.simulate(input.scenarios);
  }

  @Get('dashboard')
  dashboardSnapshot() {
    return this.dashboard.snapshot();
  }
}