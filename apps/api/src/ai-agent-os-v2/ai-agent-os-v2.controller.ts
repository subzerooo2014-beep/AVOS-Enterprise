import { Controller, Get } from '@nestjs/common';
import { AI_AGENT_OS_V2_CAPABILITIES } from './ai-agent-os-v2.types';
import { AiAgentOsV2DashboardService } from './ai-agent-os-v2-dashboard.service';
import { AiAgentOsV2OrchestratorService } from './ai-agent-os-v2-orchestrator.service';

@Controller('ai-agent-os-v2')
export class AiAgentOsV2Controller {
  constructor(
    private readonly orchestrator: AiAgentOsV2OrchestratorService,
    private readonly dashboard: AiAgentOsV2DashboardService,
  ) {}

  @Get('capabilities')
  capabilities() {
    return {
      system: 'Mega System 2 - AI Agent Operating System',
      count: AI_AGENT_OS_V2_CAPABILITIES.length,
      capabilities: AI_AGENT_OS_V2_CAPABILITIES,
    };
  }

  @Get('health')
  health() {
    return this.orchestrator.health();
  }

  @Get('dashboard')
  dashboardSnapshot() {
    const health = this.orchestrator.health();

    return this.dashboard.snapshot({
      healthyCapabilities: health.healthy,
      platformScore: health.platformHealthy ? 100 : 0,
    });
  }
}