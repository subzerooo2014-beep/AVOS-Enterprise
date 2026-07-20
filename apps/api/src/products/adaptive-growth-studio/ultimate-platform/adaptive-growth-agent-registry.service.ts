import { Injectable } from "@nestjs/common";
import { AdaptiveGrowthUltimateStoreService } from "./adaptive-growth-ultimate-store.service";

@Injectable()
export class AdaptiveGrowthAgentRegistryService {
  constructor(private readonly store: AdaptiveGrowthUltimateStoreService) {
    [
      {
        key: "growth-strategist",
        name: "Growth Strategist Agent",
        role: "strategy",
        capabilities: ["plan", "optimize", "prioritize"],
        status: "idle" as const,
        reliability: 0.88,
      },
      {
        key: "market-analyst",
        name: "Market Analyst Agent",
        role: "analysis",
        capabilities: ["analyze", "forecast", "detect-opportunity"],
        status: "idle" as const,
        reliability: 0.86,
      },
      {
        key: "risk-governor",
        name: "Risk Governor Agent",
        role: "risk",
        capabilities: ["evaluate-risk", "collect-evidence", "recommend-controls"],
        status: "idle" as const,
        reliability: 0.92,
      },
      {
        key: "execution-coordinator",
        name: "Execution Coordinator Agent",
        role: "execution",
        capabilities: ["coordinate", "dispatch", "recover"],
        status: "idle" as const,
        reliability: 0.9,
      },
    ].forEach((agent) => this.store.agents.set(agent.key, agent));
  }

  list() {
    return [...this.store.agents.values()];
  }

  select(capability: string) {
    const selected = this.list()
      .filter((agent) => agent.capabilities.includes(capability))
      .sort((a, b) => b.reliability - a.reliability)[0];

    if (!selected) {
      throw new Error(`No agent supports capability: ${capability}`);
    }

    return selected;
  }

  status() {
    return {
      status: "operational",
      agents: this.store.agents.size,
      healthy: this.list().filter((item) => item.status !== "offline").length,
    };
  }
}