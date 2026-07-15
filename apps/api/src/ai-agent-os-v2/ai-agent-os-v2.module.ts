import { Module } from '@nestjs/common';
import { AiAgentOsV2Controller } from './ai-agent-os-v2.controller';
import { AiAgentCapabilityRegistryService } from './ai-agent-capability-registry.service';
import { AiAgentOsV2OrchestratorService } from './ai-agent-os-v2-orchestrator.service';
import { AiAgentOsV2DashboardService } from './ai-agent-os-v2-dashboard.service';



@Module({
  controllers: [
    AiAgentOsV2Controller,
  ],
  providers: [
    AiAgentCapabilityRegistryService,
    AiAgentOsV2OrchestratorService,
    AiAgentOsV2DashboardService,
  ],
  exports: [
    AiAgentCapabilityRegistryService,
    AiAgentOsV2OrchestratorService,
    AiAgentOsV2DashboardService,
  ],
})
export class AiAgentOsV2Module {}