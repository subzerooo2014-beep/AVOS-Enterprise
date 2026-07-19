import { Injectable, NotFoundException } from "@nestjs/common";
import { InterplanetaryProductionContinuityStore } from "./interplanetary-production-continuity.store";
import { ContinuityScenario } from "./interplanetary-production-continuity.types";

@Injectable()
export class CivilizationalContinuityEngineService {
  constructor(private readonly store: InterplanetaryProductionContinuityStore) {}

  createScenario(input: Partial<ContinuityScenario>) {
    const now = this.store.now();
    const scenario: ContinuityScenario = {
      id: this.store.id("continuity-scenario"),
      name: input.name ?? "Civilization-scale production continuity",
      level: input.level ?? "elevated",
      affectedNodeIds: input.affectedNodeIds ?? ["civilization-node:earth"],
      requiredCapabilities: input.requiredCapabilities ?? ["production", "knowledge", "recovery"],
      recoveryStatus: "planned",
      requiresHumanApproval: input.requiresHumanApproval ?? true,
      governanceDecision: "pending",
      createdAt: now,
      updatedAt: now,
    };
    this.store.scenarios.push(scenario);
    return scenario;
  }

  approveScenario(id: string, approvedBy = "human:khalifa") {
    const scenario = this.store.scenarios.find((item) => item.id === id);
    if (!scenario) throw new NotFoundException(`Continuity scenario not found: ${id}`);
    scenario.governanceDecision = "approved";
    scenario.recoveryStatus = "ready";
    scenario.updatedAt = this.store.now();
    return { ...scenario, approvedBy };
  }
}