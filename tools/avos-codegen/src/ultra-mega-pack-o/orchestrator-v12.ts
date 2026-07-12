import { randomUUID } from "node:crypto";
import {
  UltraOEvidence,
  UltraOFinding,
  UltraOSeverity,
  UltraOStatus,
  UltraOValue,
} from "./contracts";
import {
  RealityEntity,
  RealityModelResult,
  UniversalEnterpriseRealityModel,
} from "./reality-model";
import {
  AutonomousTreatyEngine,
  TreatyParty,
  TreatyProposal,
  TreatyResult,
} from "./autonomous-treaty-engine";
import {
  CivilizationObjective,
  StrategicCivilizationPlan,
  StrategicCivilizationPlanner,
} from "./civilization-planner";
import {
  EternalKnowledgeContinuum,
  KnowledgeContinuumResult,
} from "./eternal-knowledge-continuum";
import {
  AvosOmniCoordinationCore,
  OmniCoordinationResult,
  OmniRuntime,
} from "./omni-coordination-core";

export interface OmniOrchestrationInput {
  systemKey: string;
  realityEntities: RealityEntity[];
  treatyParties: TreatyParty[];
  treatyProposal: TreatyProposal;
  civilizationObjectives: CivilizationObjective[];
  knowledgeEntries: Array<{ key: string; payload: Record<string, UltraOValue> }>;
  omniRuntimes: OmniRuntime[];
}

export interface OmniOrchestrationResult {
  success: boolean;
  status: UltraOStatus;
  score: number;
  reality: RealityModelResult;
  treaty: TreatyResult;
  civilizationPlan: StrategicCivilizationPlan;
  knowledge: KnowledgeContinuumResult;
  omni: OmniCoordinationResult;
  findings: UltraOFinding[];
  evidence: UltraOEvidence[];
  completedAt: string;
}

export class EnterpriseOmniOrchestratorV12 {
  constructor(
    readonly reality = new UniversalEnterpriseRealityModel(),
    readonly treaty = new AutonomousTreatyEngine(),
    readonly planner = new StrategicCivilizationPlanner(),
    readonly knowledge = new EternalKnowledgeContinuum(),
    readonly omni = new AvosOmniCoordinationCore(),
  ) {}

  execute(input: OmniOrchestrationInput): OmniOrchestrationResult {
    const reality = this.reality.model(input.systemKey, input.realityEntities);
    const treaty = this.treaty.negotiate(input.treatyParties, input.treatyProposal);
    const civilizationPlan = this.planner.plan(input.civilizationObjectives);

    for (const entry of input.knowledgeEntries) {
      this.knowledge.append(entry.key, entry.payload);
    }

    const knowledge = this.knowledge.verify();
    const omni = this.omni.coordinate(input.omniRuntimes);

    const findings: UltraOFinding[] = [...treaty.findings, ...omni.findings];

    if (!knowledge.continuityVerified) {
      findings.push({
        code: "ETERNAL_KNOWLEDGE_CONTINUITY_FAILED",
        severity: UltraOSeverity.CRITICAL,
        message: "Eternal knowledge continuum verification failed.",
        metadata: {},
      });
    }

    const score = Math.round(
      (
        reality.realityScore +
        treaty.score +
        civilizationPlan.planScore +
        (knowledge.continuityVerified ? 100 : 0) +
        Math.round((omni.readinessScore + omni.authorityScore) / 2)
      ) / 5,
    );

    const hasCritical = findings.some((finding) => finding.severity === UltraOSeverity.CRITICAL);
    const hasErrors = findings.some((finding) => finding.severity === UltraOSeverity.ERROR);

    const status = hasCritical
      ? UltraOStatus.BLOCKED
      : hasErrors || score < 70
        ? UltraOStatus.DEGRADED
        : UltraOStatus.READY;

    const success = status === UltraOStatus.READY;

    const evidence: UltraOEvidence[] = [
      ...reality.evidence,
      {
        id: randomUUID(),
        systemKey: input.systemKey,
        category: "enterprise-omni-orchestrator-v12",
        action: "omni-orchestration.completed",
        message: `Enterprise omni orchestration completed with status ${status}.`,
        metadata: {
          score,
          treatyRatified: treaty.ratified,
          planScore: civilizationPlan.planScore,
          continuityVerified: knowledge.continuityVerified,
          omniReadiness: omni.readinessScore,
          omniAuthority: omni.authorityScore,
        },
        createdAt: new Date().toISOString(),
      },
    ];

    return {
      success,
      status,
      score,
      reality,
      treaty,
      civilizationPlan,
      knowledge,
      omni,
      findings,
      evidence,
      completedAt: new Date().toISOString(),
    };
  }
}
