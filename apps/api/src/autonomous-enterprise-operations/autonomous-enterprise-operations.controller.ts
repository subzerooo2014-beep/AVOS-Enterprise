import { Body, Controller, Get, Post } from '@nestjs/common';
import { ExecuteMissionDto } from './dto/execute-mission.dto';
import { OperationalReadinessDto } from './dto/operational-readiness.dto';
import { AutonomousExecutionOrchestratorService } from './autonomous-execution-orchestrator.service';
import { EnterpriseCommandCenterService } from './enterprise-command-center.service';
import { OperationalReadinessIntelligenceService } from './operational-readiness-intelligence.service';
import { AutonomousOperationsDashboardService } from './autonomous-operations-dashboard.service';
import { AUTONOMOUS_ENTERPRISE_OPERATION_CAPABILITIES } from './autonomous-enterprise-operations.types';

@Controller('autonomous-enterprise-operations')
export class AutonomousEnterpriseOperationsController {
  constructor(
    private readonly orchestrator: AutonomousExecutionOrchestratorService,
    private readonly commandCenter: EnterpriseCommandCenterService,
    private readonly readiness: OperationalReadinessIntelligenceService,
    private readonly dashboard: AutonomousOperationsDashboardService,
  ) {}

  @Get('capabilities')
  capabilities() {
    return {
      bundle: 'Ultra Bundle E — Autonomous Enterprise Operations',
      count: AUTONOMOUS_ENTERPRISE_OPERATION_CAPABILITIES.length,
      capabilities: AUTONOMOUS_ENTERPRISE_OPERATION_CAPABILITIES,
    };
  }

  @Post('missions/execute')
  execute(@Body() input: ExecuteMissionDto) {
    const result = this.orchestrator.execute(
      {
        id: input.id,
        objective: input.objective,
        owner: input.owner,
        priority: input.priority,
        requiredCapabilities: input.requiredCapabilities,
        dependencies: input.dependencies ?? [],
        status: 'planned',
      },
      input.resources,
      [
        {
          id: 'default-policy',
          name: 'Default enterprise autonomous execution policy',
          maxRiskScore: 100,
          requiresApproval: false,
          allowedActions: input.requiredCapabilities,
        },
      ],
    );

    return this.commandCenter.register(result);
  }

  @Post('readiness/evaluate')
  evaluateReadiness(@Body() input: OperationalReadinessDto) {
    return this.readiness.evaluate(input.signals);
  }

  @Get('dashboard')
  dashboardSnapshot() {
    return this.dashboard.snapshot();
  }
}