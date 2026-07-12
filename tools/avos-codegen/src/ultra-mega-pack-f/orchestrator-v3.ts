import { randomUUID } from "node:crypto";
import {
  UltraFEvidence,
  UltraFFinding,
  UltraFSeverity,
  UltraFStatus,
} from "./contracts";
import {
  AutonomousEnterpriseGenerator,
  AutonomousGenerationPlan,
  EnterpriseGenerationGoal,
} from "./autonomous-generation";
import {
  EvolutionSignal,
  SelfEvolutionEngine,
  SelfEvolutionResult,
} from "./self-evolution";
import {
  ContinuousValidationMesh,
  ValidationMeshResult,
  ValidationNode,
} from "./validation-mesh";
import {
  AdaptiveBlueprintIntelligence,
  BlueprintCandidate,
  RankedBlueprint,
} from "./adaptive-blueprints";
import {
  AutonomousReleaseGovernance,
  ReleaseCandidate,
  ReleaseGovernanceDecision,
} from "./release-governance";

export interface EnterpriseGenerationOrchestrationInput {
  systemKey: string;
  goals: EnterpriseGenerationGoal[];
  evolutionSignals: EvolutionSignal[];
  validationNodes: ValidationNode[];
  requiredCapabilities: string[];
  blueprintCandidates: BlueprintCandidate[];
  releaseCandidate: ReleaseCandidate;
}

export interface EnterpriseGenerationOrchestrationResult {
  success: boolean;
  status: UltraFStatus;
  score: number;
  generation: AutonomousGenerationPlan;
  evolution: SelfEvolutionResult;
  validation: ValidationMeshResult;
  blueprints: RankedBlueprint[];
  release: ReleaseGovernanceDecision;
  findings: UltraFFinding[];
  evidence: UltraFEvidence[];
  completedAt: string;
}

export class EnterpriseGenerationOrchestratorV3 {
  constructor(
    readonly generator = new AutonomousEnterpriseGenerator(),
    readonly evolution = new SelfEvolutionEngine(),
    readonly validation = new ContinuousValidationMesh(),
    readonly blueprints = new AdaptiveBlueprintIntelligence(),
    readonly release = new AutonomousReleaseGovernance(),
  ) {}

  execute(
    input: EnterpriseGenerationOrchestrationInput,
  ): EnterpriseGenerationOrchestrationResult {
    const generation = this.generator.generate(input.systemKey, input.goals);
    const evolution = this.evolution.evolve(input.evolutionSignals);
    const validation = this.validation.validate(input.validationNodes);
    const blueprints = this.blueprints.rank(
      input.requiredCapabilities,
      input.blueprintCandidates,
    );
    const release = this.release.decide(input.releaseCandidate);

    const findings: UltraFFinding[] = [
      ...evolution.findings,
      ...validation.findings,
      ...release.findings,
    ];

    if ((blueprints[0]?.score ?? 0) < 60) {
      findings.push({
        code: "NO_SUITABLE_BLUEPRINT",
        severity: UltraFSeverity.ERROR,
        message: "No blueprint candidate reached the suitability threshold.",
        metadata: {
          candidateCount: blueprints.length,
          topScore: blueprints[0]?.score ?? 0,
        },
      });
    }

    const blueprintScore = blueprints[0]?.score ?? 0;
    const generationScore = Math.min(
      100,
      generation.modules.length * 10 + generation.goals.length * 5,
    );

    const score = Math.round(
      (generationScore +
        evolution.healthScore +
        validation.score +
        blueprintScore +
        (release.approved ? 100 : 0)) /
        5,
    );

    const hasCritical = findings.some(
      (finding) => finding.severity === UltraFSeverity.CRITICAL,
    );
    const hasErrors = findings.some(
      (finding) => finding.severity === UltraFSeverity.ERROR,
    );

    const status = hasCritical
      ? UltraFStatus.BLOCKED
      : hasErrors || !validation.passed || !release.approved || score < 65
        ? UltraFStatus.DEGRADED
        : UltraFStatus.READY;

    const success = status === UltraFStatus.READY;

    const evidence: UltraFEvidence[] = [
      {
        id: randomUUID(),
        systemKey: input.systemKey,
        category: "autonomous-enterprise-generation",
        action: "generation.completed",
        message: `Generated ${generation.modules.length} enterprise modules.`,
        metadata: {
          goals: generation.goals,
          modules: generation.modules.map((module) => module.key),
        },
        createdAt: new Date().toISOString(),
      },
      {
        id: randomUUID(),
        systemKey: input.systemKey,
        category: "enterprise-generation-orchestrator-v3",
        action: "orchestration.completed",
        message: `Autonomous enterprise generation completed with status ${status}.`,
        metadata: {
          score,
          evolutionHealth: evolution.healthScore,
          validationScore: validation.score,
          topBlueprintScore: blueprintScore,
          releaseStrategy: release.strategy,
        },
        createdAt: new Date().toISOString(),
      },
    ];

    return {
      success,
      status,
      score,
      generation,
      evolution,
      validation,
      blueprints,
      release,
      findings,
      evidence,
      completedAt: new Date().toISOString(),
    };
  }
}

