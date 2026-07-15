import { Injectable } from '@nestjs/common';
import { AgentCapabilityHealth } from './ai-agent-os-v2.types';
import { AiAgentCapabilityRegistryService } from './ai-agent-capability-registry.service';

@Injectable()
export class AiAgentOsV2OrchestratorService {
  constructor(
    private readonly registry: AiAgentCapabilityRegistryService,
  ) {}

  health() {
    const capabilities: AgentCapabilityHealth[] =
      this.registry.health();

    return {
      capabilities,
      total: capabilities.length,
      healthy: capabilities.filter(
        (item: AgentCapabilityHealth) => item.healthy,
      ).length,
      active: capabilities.reduce(
        (sum: number, item: AgentCapabilityHealth) =>
          sum + item.active,
        0,
      ),
      registered: capabilities.reduce(
        (sum: number, item: AgentCapabilityHealth) =>
          sum + item.registered,
        0,
      ),
      platformHealthy: capabilities.every(
        (item: AgentCapabilityHealth) => item.healthy,
      ),
    };
  }
}