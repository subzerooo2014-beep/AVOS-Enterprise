import { randomUUID } from "node:crypto";
import {
  GenesisEvidence,
  GenesisFinding,
  GenesisSeverity,
  GenesisStatus,
} from "./contracts";
import {
  NormalizedSystemIntent,
  SystemIntent,
  SystemIntentNormalizer,
} from "./system-intent";
import {
  DomainDecomposer,
  DomainDecompositionResult,
} from "./domain-decomposer";
import {
  ArchitectureDecision,
  ArchitectureSelector,
} from "./architecture-selector";
import {
  GenerationPlan,
  GenerationPlanner,
} from "./generation-planner";

export interface GenesisSystemBlueprint {
  blueprintId: string;
  intent: NormalizedSystemIntent;
  domains: DomainDecompositionResult;
  architecture: ArchitectureDecision;
  generationPlan: GenerationPlan;
  validationGates: string[];
  documentationPlan: string[];
  enterpriseBrainRegistration: string[];
  evolutionCenterRegistration: string[];
}

export interface GenesisExecutionResult {
  success: boolean;
  status: GenesisStatus;
  score: number;
  blueprint: GenesisSystemBlueprint;
  findings: GenesisFinding[];
  evidence: GenesisEvidence[];
  completedAt: string;
}

export class GenesisEngineV2 {
  constructor(
    readonly normalizer = new SystemIntentNormalizer(),
    readonly decomposer = new DomainDecomposer(),
    readonly architectureSelector = new ArchitectureSelector(),
    readonly planner = new GenerationPlanner(),
  ) {}

  execute(input: SystemIntent): GenesisExecutionResult {
    const intent = this.normalizer.normalize(input);
    const domains = this.decomposer.decompose(intent.domains);
    const architecture = this.architectureSelector.select(
      intent.complexityScore,
      intent.domains.length,
    );
    const generationPlan = this.planner.plan(
      domains.modules,
      architecture,
    );

    const findings = [...intent.findings];

    if (generationPlan.steps.length < 5) {
      findings.push({
        code: "GENESIS_GENERATION_PLAN_INCOMPLETE",
        severity: GenesisSeverity.ERROR,
        message: "Generation plan does not contain enough execution phases.",
        metadata: {
          steps: generationPlan.steps.length,
        },
      });
    }

    const score = Math.round(
      (
        Math.min(100, intent.complexityScore + 25) +
        architecture.score +
        Math.min(100, generationPlan.steps.length * 8) +
        Math.min(100, generationPlan.estimatedArtifacts * 2)
      ) / 4,
    );

    const hasCritical = findings.some(
      (finding) => finding.severity === GenesisSeverity.CRITICAL,
    );
    const hasErrors = findings.some(
      (finding) => finding.severity === GenesisSeverity.ERROR,
    );

    const status = hasCritical
      ? GenesisStatus.BLOCKED
      : hasErrors || score < 70
        ? GenesisStatus.DEGRADED
        : GenesisStatus.READY;

    const blueprint: GenesisSystemBlueprint = {
      blueprintId: randomUUID(),
      intent,
      domains,
      architecture,
      generationPlan,
      validationGates: [
        "typescript-build",
        "architecture-validation",
        "security-validation",
        "integration-validation",
        "smoke-validation",
      ],
      documentationPlan: [
        "system-overview",
        "architecture-decision-records",
        "api-reference",
        "operational-runbook",
      ],
      enterpriseBrainRegistration: [
        "system-intent",
        "domain-map",
        "architecture-decisions",
        "capability-catalog",
      ],
      evolutionCenterRegistration: [
        "baseline-version",
        "health-thresholds",
        "improvement-signals",
      ],
    };

    const evidence: GenesisEvidence[] = [
      {
        id: randomUUID(),
        category: "genesis-engine-v2",
        action: "system-blueprint.generated",
        message: `Generated system blueprint for ${input.systemKey}.`,
        metadata: {
          score,
          status,
          modules: domains.modules.length,
          generationSteps: generationPlan.steps.length,
          estimatedArtifacts: generationPlan.estimatedArtifacts,
          architectureStyle: architecture.style,
        },
        createdAt: new Date().toISOString(),
      },
    ];

    return {
      success: status === GenesisStatus.READY,
      status,
      score,
      blueprint,
      findings,
      evidence,
      completedAt: new Date().toISOString(),
    };
  }
}
