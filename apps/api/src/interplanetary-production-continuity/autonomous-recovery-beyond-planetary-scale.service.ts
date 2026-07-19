import { Injectable, NotFoundException } from "@nestjs/common";
import { InterplanetaryProductionContinuityStore } from "./interplanetary-production-continuity.store";

@Injectable()
export class AutonomousRecoveryBeyondPlanetaryScaleService {
  constructor(private readonly store: InterplanetaryProductionContinuityStore) {}

  plan(scenarioId: string) {
    const scenario = this.store.scenarios.find((item) => item.id === scenarioId);
    if (!scenario) throw new NotFoundException(`Continuity scenario not found: ${scenarioId}`);

    const candidates = this.store.nodes
      .filter((node) => node.status === "operational")
      .filter((node) => scenario.requiredCapabilities.every((capability) => node.supportedCapabilities.includes(capability)))
      .sort((a, b) => (b.resilienceScore + b.autonomyScore) - (a.resilienceScore + a.autonomyScore));

    const plan = {
      id: this.store.id("interplanetary-recovery"),
      scenarioId,
      selectedNodeIds: candidates.slice(0, 2).map((node) => node.id),
      phases: [
        "isolate-failure-domain",
        "preserve-human-command",
        "activate-distributed-production",
        "restore-knowledge-and-governance",
        "reconcile-federation-state",
      ],
      estimatedContinuityScore: candidates.length
        ? Number((candidates.slice(0, 2).reduce((sum, node) => sum + node.resilienceScore, 0) / Math.min(2, candidates.length)).toFixed(2))
        : 0,
      autonomousActions: [
        "replicate-approved-production-blueprints",
        "activate-delay-tolerant-coordination",
        "rebalance-non-sovereign-workloads",
      ],
      protectedActions: [
        "constitutional-change",
        "human-authority-transfer",
        "civilization-memory-destruction",
        "irreversible-governance-action",
      ],
      status: scenario.governanceDecision === "approved" ? "ready" as const : "planned" as const,
      createdAt: this.store.now(),
    };
    this.store.recoveryPlans.push(plan);
    return plan;
  }

  activate(planId: string) {
    const plan = this.store.recoveryPlans.find((item) => item.id === planId);
    if (!plan) throw new NotFoundException(`Recovery plan not found: ${planId}`);
    const scenario = this.store.scenarios.find((item) => item.id === plan.scenarioId);
    if (!scenario || scenario.governanceDecision !== "approved") {
      throw new Error("Human approval is required before civilization-scale recovery activation.");
    }
    plan.status = "activated";
    scenario.recoveryStatus = "activated";
    scenario.updatedAt = this.store.now();
    return plan;
  }
}