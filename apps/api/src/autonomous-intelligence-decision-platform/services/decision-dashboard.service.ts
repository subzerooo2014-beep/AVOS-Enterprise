import { Injectable } from "@nestjs/common";

@Injectable()
export class DecisionDashboardService {
  summary() {
    return {
      strategicGoals: 0,
      activePlans: 0,
      decisions: 0,
      activeAgents: 0,
      simulations: 0,
      recommendations: 0,
      healthStatus: "healthy",
    };
  }
}
