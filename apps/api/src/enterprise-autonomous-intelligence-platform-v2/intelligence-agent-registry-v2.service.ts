import { Injectable, NotFoundException } from "@nestjs/common";
import type { IntelligenceAgentV2 } from "./autonomous-intelligence-v2.types";

@Injectable()
export class IntelligenceAgentRegistryV2Service {
  private readonly agents = new Map<string, IntelligenceAgentV2>();

  register(
    input: Omit<IntelligenceAgentV2, "createdAt" | "updatedAt">,
  ): IntelligenceAgentV2 {
    const existing = this.agents.get(input.id);
    const now = new Date().toISOString();

    const agent: IntelligenceAgentV2 = {
      ...input,
      capabilities: [...input.capabilities],
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };

    this.agents.set(agent.id, agent);
    return this.clone(agent);
  }

  get(id: string): IntelligenceAgentV2 {
    const agent = this.agents.get(id);

    if (!agent) {
      throw new NotFoundException(`Intelligence agent '${id}' was not found.`);
    }

    return this.clone(agent);
  }

  list(): IntelligenceAgentV2[] {
    return Array.from(this.agents.values()).map((agent) => this.clone(agent));
  }

  count(): number {
    return this.agents.size;
  }

  activeCount(): number {
    return this.list().filter((agent) => agent.status === "ACTIVE").length;
  }

  private clone(agent: IntelligenceAgentV2): IntelligenceAgentV2 {
    return { ...agent, capabilities: [...agent.capabilities] };
  }
}
