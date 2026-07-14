import { Body, Controller, Get, Post } from '@nestjs/common';
import { RunCognitionDto } from './dto/run-cognition.dto';
import { ExecutiveDecisionDto } from './dto/executive-decision.dto';
import { EnterpriseCognitiveOrchestratorService } from './enterprise-cognitive-orchestrator.service';
import { ExecutiveDecisionSupportService } from './executive-decision-support.service';
import { EnterpriseCognitiveDashboardService } from './enterprise-cognitive-dashboard.service';
import { ENTERPRISE_COGNITION_CAPABILITIES } from './enterprise-cognition.types';

@Controller('enterprise-cognition')
export class EnterpriseCognitionController {
  constructor(
    private readonly orchestrator: EnterpriseCognitiveOrchestratorService,
    private readonly executive: ExecutiveDecisionSupportService,
    private readonly dashboard: EnterpriseCognitiveDashboardService,
  ) {}

  @Get('capabilities')
  capabilities() {
    return {
      bundle: 'Ultra Bundle D — Autonomous Intelligence & Enterprise Cognition',
      count: ENTERPRISE_COGNITION_CAPABILITIES.length,
      capabilities: ENTERPRISE_COGNITION_CAPABILITIES,
    };
  }

  @Post('run')
  run(@Body() input: RunCognitionDto) {
    return this.orchestrator.run(
      input.objective,
      input.signals,
      input.horizonDays,
    );
  }

  @Post('executive-decision')
  executiveDecision(@Body() input: ExecutiveDecisionDto) {
    return this.executive.createBrief(
      input.objective,
      input.options,
      0.8,
      [`Evaluated ${input.options.length} executive options`],
    );
  }

  @Get('dashboard')
  dashboardSnapshot() {
    return this.dashboard.snapshot();
  }
}