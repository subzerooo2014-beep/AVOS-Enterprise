import { Injectable } from '@nestjs/common';
import {
  AiTask,
  EnterpriseAgent,
} from './enterprise-ai-operations.types';

@Injectable()
export class IntelligentTaskOrchestratorService {
  assign(tasks: AiTask[], agents: EnterpriseAgent[]) {
    return tasks.map((task) => {
      const candidates = agents
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
        );

      return {
        taskId: task.id,
        agentId: candidates[0]?.id ?? null,
        assigned: Boolean(candidates[0]),
      };
    });
  }
}