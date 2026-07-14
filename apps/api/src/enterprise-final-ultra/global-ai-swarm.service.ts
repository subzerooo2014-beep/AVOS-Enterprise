import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { AgentNode } from "./enterprise-final-ultra.types";

@Injectable()
export class GlobalAiSwarmService {
  private readonly agents: AgentNode[] = [];

  register(name: string, role: string, trustScore = 95): AgentNode {
    const agent: AgentNode = {
      id: randomUUID(),
      name,
      role,
      trustScore,
      active: true,
    };

    this.agents.push(agent);
    return agent;
  }

  coordinate(mission = "global-enterprise-execution") {
    const active = this.agents.filter((agent) => agent.active);
    const trustScore =
      active.length === 0
        ? 0
        : Math.round(
            active.reduce((sum, agent) => sum + agent.trustScore, 0) /
              active.length,
          );

    return {
      mission,
      agents: active.map((agent) => agent.name),
      coordinated: active.length >= 3,
      trustScore,
      completedAt: new Date().toISOString(),
    };
  }

  count(): number {
    return this.agents.length;
  }
}