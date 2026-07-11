import { randomUUID } from "node:crypto";
import {
  ArchitectureEvolutionDecisionResult,
  ArchitectureEvolutionKnowledgeRecord,
  ArchitectureEvolutionSimulation,
  ArchitectureHealingPlan,
} from "./contracts";

export class ArchitectureEvolutionKnowledgeRecorder {
  record(
    simulation:
      ArchitectureEvolutionSimulation,
    healing:
      ArchitectureHealingPlan,
    decision:
      ArchitectureEvolutionDecisionResult,
  ): ArchitectureEvolutionKnowledgeRecord[] {
    return [
      {
        id: randomUUID(),
        systemKey:
          simulation.baseline.systemKey,
        topic:
          "architecture.evolution.simulation",
        summary:
          `Architecture evolution projected score ${simulation.projectedScore}.`,
        facts: {
          baselineVersion:
            simulation.baseline.version,
          candidateVersion:
            simulation.candidate.version,
          confidence:
            simulation.confidence,
          risks:
            simulation.risks,
          benefits:
            simulation.benefits,
        },
        createdAt:
          new Date().toISOString(),
      },
      {
        id: randomUUID(),
        systemKey:
          simulation.baseline.systemKey,
        topic:
          "architecture.self-healing",
        summary:
          `Self-healing plan contains ${healing.actions.length} action(s).`,
        facts: {
          actionCount:
            healing.actions.length,
          automationCoverage:
            healing.automationCoverage,
        },
        createdAt:
          new Date().toISOString(),
      },
      {
        id: randomUUID(),
        systemKey:
          simulation.baseline.systemKey,
        topic:
          "architecture.evolution.decision",
        summary:
          `Architecture evolution decision: ${decision.decision}.`,
        facts: {
          approved:
            decision.approved,
          score:
            decision.score,
          confidence:
            decision.confidence,
          controls:
            decision.controls,
        },
        createdAt:
          new Date().toISOString(),
      },
    ];
  }
}
