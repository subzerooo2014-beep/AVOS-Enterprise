import { Injectable } from '@nestjs/common';
import { EnterpriseAgent } from './enterprise-ai-operations.types';

@Injectable()
export class EnterpriseAgentManagerService {
  rank(agents: EnterpriseAgent[]) {
    return [...agents]
      .map((agent) => ({
        ...agent,
        performanceScore: Math.round(
          agent.successRate * 70 +
            Math.max(0, 30 - agent.currentLoad * 3),
        ),
      }))
      .sort((a, b) => b.performanceScore - a.performanceScore);
  }
}