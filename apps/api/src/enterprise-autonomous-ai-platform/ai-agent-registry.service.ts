import { Injectable, NotFoundException } from "@nestjs/common";
import type { AiAgentRecord } from "./enterprise-autonomous-ai.types";

@Injectable()
export class AiAgentRegistryService {
  private readonly agents = new Map<string, AiAgentRecord>();

  register(agent: AiAgentRecord): AiAgentRecord {
    this.agents.set(agent.id, {
      ...agent,
      skills: [...agent.skills],
      tools: [...agent.tools],
      policies: [...agent.policies],
    });
    return this.get(agent.id);
  }

  get(id: string): AiAgentRecord {
    const agent = this.agents.get(id);
    if (!agent) throw new NotFoundException(`AI agent '${id}' was not found.`);
    return {
      ...agent,
      skills: [...agent.skills],
      tools: [...agent.tools],
      policies: [...agent.policies],
    };
  }

  list(): AiAgentRecord[] {
    return Array.from(this.agents.values()).map((agent) => this.get(agent.id));
  }

  count(): number {
    return this.agents.size;
  }
}
