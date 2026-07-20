import { Injectable, NotFoundException } from '@nestjs/common';
import {
  AgentDefinition,
  AgentDefinitionInput,
} from './digital-organization.types';

@Injectable()
export class AgentRegistryService {
  private readonly agents = new Map<string, AgentDefinition>();

  register(input: AgentDefinitionInput): AgentDefinition {
    const now = new Date().toISOString();

    const agent: AgentDefinition = {
      id: `agent-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: input.name,
      role: input.role,
      capabilities: [...new Set(input.capabilities)],
      permissions: [...new Set(input.permissions)],
      projectIds: input.projectIds ?? [],
      status: 'registered',
      certified: false,
      createdAt: now,
      updatedAt: now,
    };

    this.agents.set(agent.id, agent);
    return this.clone(agent);
  }

  certify(id: string, approvedBy: string): AgentDefinition {
    const agent = this.require(id);

    if (!approvedBy.toLowerCase().startsWith('human:')) {
      throw new Error('Agent certification requires Human Final Authority.');
    }

    agent.certified = true;
    agent.status = 'active';
    agent.certificationApprovedBy = approvedBy;
    agent.updatedAt = new Date().toISOString();

    return this.clone(agent);
  }

  require(id: string): AgentDefinition {
    const agent = this.agents.get(id);

    if (!agent) {
      throw new NotFoundException(`Agent ${id} was not found.`);
    }

    return agent;
  }

  findCertifiedByCapability(capability: string): AgentDefinition[] {
    return [...this.agents.values()]
      .filter(
        (agent) =>
          agent.certified &&
          agent.status === 'active' &&
          agent.capabilities.includes(capability),
      )
      .map((agent) => this.clone(agent));
  }

  list(): AgentDefinition[] {
    return [...this.agents.values()].map((agent) => this.clone(agent));
  }

  get(id: string): AgentDefinition {
    return this.clone(this.require(id));
  }

  private clone(agent: AgentDefinition): AgentDefinition {
    return JSON.parse(JSON.stringify(agent)) as AgentDefinition;
  }
}