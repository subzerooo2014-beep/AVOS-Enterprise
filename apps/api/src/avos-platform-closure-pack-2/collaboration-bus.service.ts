import { Injectable } from '@nestjs/common';
import { AgentRegistryService } from './agent-registry.service';
import { AgentMessage } from './digital-organization.types';
import { TeamRuntimeService } from './team-runtime.service';

@Injectable()
export class CollaborationBusService {
  private readonly messages: AgentMessage[] = [];

  constructor(
    private readonly agents: AgentRegistryService,
    private readonly teams: TeamRuntimeService,
  ) {}

  publish(input: Omit<AgentMessage, 'id' | 'createdAt'>): AgentMessage {
    const team = this.teams.require(input.teamId);
    const sender = this.agents.get(input.fromAgentId);

    if (!team.agentIds.includes(sender.id)) {
      throw new Error('Sender is not a member of the target team.');
    }

    if (!sender.permissions.includes('inter-agent:communicate')) {
      throw new Error('Sender lacks inter-agent communication permission.');
    }

    if (input.toAgentId) {
      const receiver = this.agents.get(input.toAgentId);

      if (!team.agentIds.includes(receiver.id)) {
        throw new Error('Receiver is not a member of the target team.');
      }
    }

    const message: AgentMessage = {
      id: `agent-message-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}`,
      ...input,
      createdAt: new Date().toISOString(),
    };

    this.messages.push(message);
    return JSON.parse(JSON.stringify(message)) as AgentMessage;
  }

  list(teamId?: string): AgentMessage[] {
    return this.messages
      .filter((message) => !teamId || message.teamId === teamId)
      .map((message) => JSON.parse(JSON.stringify(message)));
  }
}