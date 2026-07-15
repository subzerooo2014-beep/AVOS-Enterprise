import { Injectable } from '@nestjs/common';
import { EnterpriseAgent } from './enterprise-ai-operations.types';

@Injectable()
export class MultiAgentCollaborationEngineService {
  compose(
    agents: EnterpriseAgent[],
    requiredCapabilities: string[],
  ) {
    const selected: EnterpriseAgent[] = [];
    const covered = new Set<string>();

    for (const capability of requiredCapabilities) {
      const agent = agents
        .filter(
          (candidate) =>
            candidate.active &&
            candidate.capabilities.includes(capability),
        )
        .sort(
          (a, b) =>
            b.successRate - a.successRate ||
            a.currentLoad - b.currentLoad,
        )[0];

      if (agent && !selected.some((item) => item.id === agent.id)) {
        selected.push(agent);
      }

      if (agent) covered.add(capability);
    }

    return {
      agents: selected.map((agent) => agent.id),
      coveredCapabilities: [...covered],
      complete: covered.size === requiredCapabilities.length,
    };
  }
}