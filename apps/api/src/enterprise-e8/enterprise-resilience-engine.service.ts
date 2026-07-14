import { Injectable } from "@nestjs/common";
import { EnterpriseScenarioSimulatorService } from "./enterprise-scenario-simulator.service";

@Injectable()
export class EnterpriseResilienceEngineService {
  constructor(
    private readonly scenarios: EnterpriseScenarioSimulatorService,
  ) {}

  evaluate() {
    const scenario = this.scenarios.simulate("Enterprise resilience evaluation");
    const resilienceScore = Math.max(0, 100 - Math.round(scenario.impactScore * 0.35));
    const controls = [
      "operational-fallback",
      "decision-governance",
      "scenario-containment",
      "service-continuity",
    ];

    return {
      scenario,
      resilienceScore,
      controls,
      ready: resilienceScore >= 60,
      evaluatedAt: new Date().toISOString(),
    };
  }
}