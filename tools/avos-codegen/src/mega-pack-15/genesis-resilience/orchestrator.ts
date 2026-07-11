import {
  EvolutionChange,
  GenesisResilienceResult,
  ResilienceSimulationInput,
} from "./contracts";
import {
  GenesisResilienceDecisionEngine,
} from "./decision-engine";
import {
  GenesisResilienceEvidenceLedger,
} from "./evidence-ledger";
import {
  GenesisEvolutionImpactForecaster,
} from "./evolution-impact-forecaster";
import {
  GenesisResilienceKnowledgeRecorder,
} from "./knowledge-recorder";
import {
  GenesisRecoveryStrategyGenerator,
} from "./recovery-strategy-generator";
import {
  GenesisResilienceScenarioSimulator,
} from "./scenario-simulator";

export interface GenesisResilienceInput {
  simulation:
    ResilienceSimulationInput;
  proposedChanges:
    EvolutionChange[];
}

export class GenesisResilienceOrchestrator {
  readonly simulator =
    new GenesisResilienceScenarioSimulator();

  readonly recovery =
    new GenesisRecoveryStrategyGenerator();

  readonly forecaster =
    new GenesisEvolutionImpactForecaster();

  readonly decisions =
    new GenesisResilienceDecisionEngine();

  readonly evidence =
    new GenesisResilienceEvidenceLedger();

  readonly knowledge =
    new GenesisResilienceKnowledgeRecorder();

  execute(
    input:
      GenesisResilienceInput,
  ): GenesisResilienceResult {
    const simulation =
      this.simulator.simulate(
        input.simulation,
      );

    this.evidence.append({
      systemKey:
        input.simulation.systemKey,
      category:
        "simulation",
      action:
        "scenarios.simulated",
      message:
        `Executed ${simulation.scenarioResults.length} resilience scenario(s).`,
      metadata: {
        aggregateScore:
          simulation.aggregateScore,
        criticalFindings:
          simulation.criticalFindings.length,
      },
    });

    const recoveryStrategy =
      this.recovery.generate(
        input.simulation.systemKey,
        input.simulation.components,
        simulation,
      );

    const forecast =
      this.forecaster.forecast({
        systemKey:
          input.simulation.systemKey,
        currentScore:
          simulation.aggregateScore,
        proposedChanges:
          input.proposedChanges,
        simulation,
      });

    const decision =
      this.decisions.decide(
        simulation,
        recoveryStrategy,
        forecast,
      );

    this.evidence.append({
      systemKey:
        input.simulation.systemKey,
      category:
        "decision",
      action:
        "resilience.decided",
      message:
        `Resilience decision: ${decision.decision}.`,
      metadata: {
        approved:
          decision.approved,
        score:
          decision.score,
        confidence:
          decision.confidence,
      },
    });

    const knowledge =
      this.knowledge.record(
        input.simulation.systemKey,
        simulation,
        recoveryStrategy,
        forecast,
      );

    return {
      success:
        decision.approved,
      simulation,
      recoveryStrategy,
      forecast,
      decision,
      evidence:
        this.evidence.list(
          input.simulation.systemKey,
        ),
      knowledge,
      completedAt:
        new Date().toISOString(),
    };
  }
}
