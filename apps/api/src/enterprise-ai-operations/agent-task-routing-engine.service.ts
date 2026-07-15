import { Injectable } from '@nestjs/common';
import {
  AiTask,
  EnterpriseAgent,
} from './enterprise-ai-operations.types';

@Injectable()
export class AgentTaskRoutingEngineService {
  route(task: AiTask, agents: EnterpriseAgent[]) {
    const selected = agents
      .filter(
        (agent) =>
          agent.active &&
          task.requiredCapabilities.every((capability) =>
            agent.capabilities.includes(capability),
          ),
      )
      .sort(
        (a, b) =>
          a.currentLoad - b.currentLoad ||
          b.successRate - a.successRate,
      )[0];

    return {
      taskId: task.id,
      agentId: selected?.id ?? null,
      routed: Boolean(selected),
    };
  }
}