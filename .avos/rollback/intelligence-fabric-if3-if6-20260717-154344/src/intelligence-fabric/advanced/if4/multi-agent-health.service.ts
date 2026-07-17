import { Injectable } from "@nestjs/common";
import { IntelligenceAgentRegistryService } from "./intelligence-agent-registry.service";
import { MultiAgentTaskOrchestratorService } from "./multi-agent-task-orchestrator.service";

@Injectable()
export class MultiAgentHealthService {
  constructor(
    private readonly registry: IntelligenceAgentRegistryService,
    private readonly orchestrator: MultiAgentTaskOrchestratorService,
  ) {}

  snapshot(): Record<string, unknown> {
    const agents = this.registry.list();
    const enabled = agents.filter((agent) => agent.enabled).length;

    return {
      status: enabled > 0 ? "healthy" : "degraded",
      totalAgents: agents.length,
      enabledAgents: enabled,
      recordedTasks: this.orchestrator.listTasks(1000).length,
      checkedAt: new Date().toISOString(),
    };
  }
}