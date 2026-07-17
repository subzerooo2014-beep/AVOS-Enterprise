import { Injectable } from "@nestjs/common";
import {
  IntelligenceAgentDescriptor,
} from "../contracts/advanced-intelligence.contracts";

@Injectable()
export class IntelligenceAgentRegistryService {
  private readonly agents = new Map<string, IntelligenceAgentDescriptor>();

  constructor() {
    this.registerDefaults();
  }

  register(agent: IntelligenceAgentDescriptor): IntelligenceAgentDescriptor {
    this.agents.set(agent.id, agent);
    return agent;
  }

  get(id: string): IntelligenceAgentDescriptor | undefined {
    return this.agents.get(id);
  }

  list(): readonly IntelligenceAgentDescriptor[] {
    return [...this.agents.values()];
  }

  available(): readonly IntelligenceAgentDescriptor[] {
    return this.list().filter((agent) => agent.enabled);
  }

  private registerDefaults(): void {
    const defaults: IntelligenceAgentDescriptor[] = [
      {
        id: "research-agent",
        name: "AVOS Research Agent",
        role: "research",
        capabilities: ["research", "evidence", "knowledge"],
        status: "idle",
        priority: 80,
        enabled: true,
      },
      {
        id: "analysis-agent",
        name: "AVOS Analysis Agent",
        role: "analysis",
        capabilities: ["analysis", "reasoning", "comparison"],
        status: "idle",
        priority: 90,
        enabled: true,
      },
      {
        id: "risk-agent",
        name: "AVOS Risk Agent",
        role: "risk",
        capabilities: ["risk", "compliance", "governance"],
        status: "idle",
        priority: 95,
        enabled: true,
      },
      {
        id: "decision-agent",
        name: "AVOS Decision Agent",
        role: "decision",
        capabilities: ["decision", "recommendation", "approval"],
        status: "idle",
        priority: 100,
        enabled: true,
      },
    ];

    for (const item of defaults) this.register(item);
  }
}