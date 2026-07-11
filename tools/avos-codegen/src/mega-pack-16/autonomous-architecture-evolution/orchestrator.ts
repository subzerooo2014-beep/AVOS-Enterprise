import {
  ArchitectureConflict,
  ArchitectureEvolutionResult,
  ArchitectureSnapshot,
} from "./contracts";
import {
  ArchitectureEvolutionApprovalPipeline,
} from "./approval-pipeline";
import {
  ArchitectureCompatibilityAnalyzer,
} from "./compatibility-analyzer";
import {
  ArchitectureDependencyConflictResolver,
} from "./conflict-resolver";
import {
  MultiVersionArchitectureEvolutionSimulator,
} from "./evolution-simulator";
import {
  ArchitectureEvolutionKnowledgeRecorder,
} from "./knowledge-recorder";
import {
  AutonomousArchitectureMutationPlanner,
} from "./mutation-planner";
import {
  IntelligentArchitectureRefactoringPlanner,
} from "./refactoring-planner";
import {
  SelfHealingArchitectureEngine,
} from "./self-healing-engine";

export interface AutonomousArchitectureEvolutionInput {
  snapshot: ArchitectureSnapshot;
  conflicts: ArchitectureConflict[];
}

export class AutonomousArchitectureEvolutionOrchestrator {
  readonly mutations =
    new AutonomousArchitectureMutationPlanner();

  readonly compatibility =
    new ArchitectureCompatibilityAnalyzer();

  readonly simulator =
    new MultiVersionArchitectureEvolutionSimulator();

  readonly conflicts =
    new ArchitectureDependencyConflictResolver();

  readonly refactoring =
    new IntelligentArchitectureRefactoringPlanner();

  readonly healing =
    new SelfHealingArchitectureEngine();

  readonly approval =
    new ArchitectureEvolutionApprovalPipeline();

  readonly knowledge =
    new ArchitectureEvolutionKnowledgeRecorder();

  execute(
    input:
      AutonomousArchitectureEvolutionInput,
  ): ArchitectureEvolutionResult {
    const mutationPlan =
      this.mutations.plan(
        input.snapshot,
      );

    const compatibility =
      this.compatibility.analyze(
        input.snapshot,
        mutationPlan,
      );

    const simulation =
      this.simulator.simulate(
        input.snapshot,
        mutationPlan,
        compatibility,
      );

    const resolutions =
      this.conflicts.resolve(
        input.conflicts,
      );

    const refactoring =
      this.refactoring.recommend(
        input.snapshot,
      );

    const healing =
      this.healing.createPlan(
        simulation.candidate,
      );

    const decision =
      this.approval.decide(
        simulation,
        healing,
      );

    const knowledge =
      this.knowledge.record(
        simulation,
        healing,
        decision,
      );

    return {
      success:
        decision.approved,
      mutationPlan,
      simulation,
      conflicts:
        structuredClone(
          input.conflicts,
        ),
      resolutions,
      refactoring,
      healing,
      decision,
      knowledge,
      completedAt:
        new Date().toISOString(),
    };
  }
}
