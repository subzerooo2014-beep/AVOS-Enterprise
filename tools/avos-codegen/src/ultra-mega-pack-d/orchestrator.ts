import { randomUUID } from "node:crypto";
import {
  UltraDDecision,
  UltraDEvidence,
  UltraDFinding,
  UltraDSeverity,
} from "./contracts";
import {
  AvosDigitalConstitution,
  ConstitutionEvaluationInput,
  ConstitutionEvaluationResult,
} from "./digital-constitution";
import {
  DecisionTrace,
  EnterpriseDecisionGraph,
} from "./decision-graph";
import {
  AiStrategicPlanner,
  StrategicObjective,
  StrategicPlan,
  StrategicScenario,
} from "./strategic-planner";
import {
  EnterpriseResilienceLaboratory,
  ResilienceComponent,
  ResilienceExperiment,
  ResilienceLaboratoryReport,
} from "./resilience-laboratory";
import {
  GlobalStandardRequirement,
  GlobalStandardsObservatory,
  ImplementedControl,
  StandardsObservatoryReport,
} from "./standards-observatory";

export interface UltraMegaPackDInput {
  systemKey: string;
  constitution: ConstitutionEvaluationInput;
  decisionKey: string;
  objectives: StrategicObjective[];
  scenarios: StrategicScenario[];
  resilienceComponents: ResilienceComponent[];
  resilienceExperiments: ResilienceExperiment[];
  standardRequirements: GlobalStandardRequirement[];
  implementedControls: ImplementedControl[];
}

export interface UltraMegaPackDResult {
  success: boolean;
  decision: UltraDDecision;
  score: number;
  controls: string[];
  constitution: ConstitutionEvaluationResult;
  trace: DecisionTrace;
  strategy: StrategicPlan;
  resilience: ResilienceLaboratoryReport;
  standards: StandardsObservatoryReport;
  findings: UltraDFinding[];
  evidence: UltraDEvidence[];
  completedAt: string;
}

export class UltraMegaPackDOrchestrator {
  constructor(
    readonly constitution = new AvosDigitalConstitution(),
    readonly decisionGraph = new EnterpriseDecisionGraph(),
    readonly planner = new AiStrategicPlanner(),
    readonly resilienceLab = new EnterpriseResilienceLaboratory(),
    readonly standards = new GlobalStandardsObservatory(),
  ) {}

  execute(input: UltraMegaPackDInput): UltraMegaPackDResult {
    const constitution = this.constitution.evaluate(input.constitution);
    const trace = this.decisionGraph.trace(input.systemKey, input.decisionKey);
    const strategy = this.planner.plan(
      input.systemKey,
      input.objectives,
      input.scenarios,
    );
    const resilience = this.resilienceLab.simulate(
      input.resilienceComponents,
      input.resilienceExperiments,
    );
    const standards = this.standards.analyze(
      input.standardRequirements,
      input.implementedControls,
    );

    const findings: UltraDFinding[] = [
      ...constitution.findings,
      ...strategy.findings,
      ...resilience.results.flatMap((result) => result.findings),
      ...standards.findings,
    ];

    const controls = new Set<string>(constitution.controls);
    if (resilience.failedExperiments > 0) controls.add("resilience-remediation");
    if (standards.gaps.length > 0) controls.add("standards-remediation");
    if (trace.aggregateConfidence < 65) controls.add("decision-human-review");

    const score = Math.round(
      (constitution.score +
        trace.aggregateConfidence +
        strategy.score +
        resilience.aggregateScore +
        standards.coverage) /
        5,
    );

    const hasCritical = findings.some(
      (finding) => finding.severity === UltraDSeverity.CRITICAL,
    );
    const hasErrors = findings.some(
      (finding) => finding.severity === UltraDSeverity.ERROR,
    );

    let decision: UltraDDecision;
    if (hasCritical || !constitution.compliant || score < 40) {
      decision = UltraDDecision.REJECT;
    } else if (hasErrors || score < 65) {
      decision = UltraDDecision.REQUIRE_REVIEW;
    } else if (controls.size > 0) {
      decision = UltraDDecision.APPROVE_WITH_CONTROLS;
    } else {
      decision = UltraDDecision.APPROVE;
    }

    const success =
      decision === UltraDDecision.APPROVE ||
      decision === UltraDDecision.APPROVE_WITH_CONTROLS;

    const evidence: UltraDEvidence[] = [
      ...trace.evidence,
      {
        id: randomUUID(),
        systemKey: input.systemKey,
        category: "ultra-mega-pack-d",
        action: "strategic-governance.completed",
        message: `Strategic governance completed with decision ${decision}.`,
        metadata: {
          score,
          constitutionScore: constitution.score,
          strategicScore: strategy.score,
          resilienceScore: resilience.aggregateScore,
          standardsCoverage: standards.coverage,
          decisionConfidence: trace.aggregateConfidence,
        },
        createdAt: new Date().toISOString(),
      },
    ];

    return {
      success,
      decision,
      score,
      controls: Array.from(controls),
      constitution,
      trace,
      strategy,
      resilience,
      standards,
      findings,
      evidence,
      completedAt: new Date().toISOString(),
    };
  }
}
