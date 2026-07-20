import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import { AeosPlan } from "./aeos.contracts";

@Injectable()
export class EnterpriseAgentOrchestratorService {
  private readonly agents = [
    { key: "goal-agent", specialization: "goal-management", capacity: 100 },
    { key: "planning-agent", specialization: "planning", capacity: 100 },
    { key: "decision-agent", specialization: "decision", capacity: 100 },
    { key: "risk-agent", specialization: "risk", capacity: 100 },
    { key: "execution-agent", specialization: "execution", capacity: 100 },
    { key: "learning-agent", specialization: "learning", capacity: 100 },
  ];

  orchestrate(plan: AeosPlan) {
    const assignments = plan.steps.map((step, index) => ({
      id: "aeos-assignment:" + randomUUID(),
      stepId: step.id,
      agent: this.agents[index % this.agents.length].key,
      targetUnit: step.targetUnit,
      status: "assigned",
      assignedAt: new Date().toISOString(),
    }));

    return {
      planId: plan.id,
      agents: this.agents,
      assignments,
      status: "coordinated",
      coordinatedAt: new Date().toISOString(),
    };
  }

  registry() {
    return this.agents;
  }
}