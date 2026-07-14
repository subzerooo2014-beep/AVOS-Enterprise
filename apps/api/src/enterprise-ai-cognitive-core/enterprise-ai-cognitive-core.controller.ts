import { Body, Controller, Get, Post } from '@nestjs/common';
import { RunCognitiveCycleDto } from './dto/run-cognitive-cycle.dto';
import { MemoryGraphDto } from './dto/memory-graph.dto';
import { GoalManagementDto } from './dto/goal-management.dto';
import { CognitiveWorkflowOrchestratorService } from './cognitive-workflow-orchestrator.service';
import { EnterpriseMemoryGraphV2Service } from './enterprise-memory-graph-v2.service';
import { AutonomousGoalManagementService } from './autonomous-goal-management.service';
import { EnterpriseCognitiveDashboardService } from './enterprise-cognitive-dashboard.service';
import { ENTERPRISE_AI_COGNITIVE_CORE_CAPABILITIES } from './enterprise-ai-cognitive-core.types';

@Controller('enterprise-ai-cognitive-core')
export class EnterpriseAiCognitiveCoreController {
  constructor(
    private readonly orchestrator: CognitiveWorkflowOrchestratorService,
    private readonly memoryGraph: EnterpriseMemoryGraphV2Service,
    private readonly goals: AutonomousGoalManagementService,
    private readonly dashboard: EnterpriseCognitiveDashboardService,
  ) {}

  @Get('capabilities')
  capabilities() {
    return {
      bundle:
        'Ultra Bundle N — Enterprise AI Cognitive Core & Autonomous Reasoning',
      count: ENTERPRISE_AI_COGNITIVE_CORE_CAPABILITIES.length,
      capabilities: ENTERPRISE_AI_COGNITIVE_CORE_CAPABILITIES,
    };
  }

  @Post('cycle/run')
  runCycle(@Body() input: RunCognitiveCycleDto) {
    return this.orchestrator.run(
      input.objective,
      input.signals,
      input.horizonDays,
    );
  }

  @Post('memory/graph')
  buildMemoryGraph(@Body() input: MemoryGraphDto) {
    return this.memoryGraph.build(input.nodes, input.edges);
  }

  @Post('goals/evaluate')
  evaluateGoals(@Body() input: GoalManagementDto) {
    return this.goals.evaluate(input.goals);
  }

  @Get('dashboard')
  dashboardSnapshot() {
    return this.dashboard.snapshot();
  }
}