import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { InspectionRuntimeService } from "../inspection-runtime.service";
import { OmegaPolicyEngineService } from "./engines/omega-policy-engine.service";
import { OmegaReadinessEngineService } from "./engines/omega-readiness-engine.service";
import { OmegaRiskEngineService } from "./engines/omega-risk-engine.service";
import { OmegaRuleEngineService } from "./engines/omega-rule-engine.service";
import { OmegaScoreEngineService } from "./engines/omega-score-engine.service";
import { OmegaHistoryService } from "./history/omega-history.service";
import { OmegaAssessment, OmegaFinding, OmegaSeverity } from "./omega.types";

@Injectable()
export class OmegaOrchestratorService {
  constructor(
    private readonly runtime: InspectionRuntimeService,
    private readonly ruleEngine: OmegaRuleEngineService,
    private readonly policyEngine: OmegaPolicyEngineService,
    private readonly scoreEngine: OmegaScoreEngineService,
    private readonly riskEngine: OmegaRiskEngineService,
    private readonly readinessEngine: OmegaReadinessEngineService,
    private readonly history: OmegaHistoryService,
  ) {}

  async assess(): Promise<{
    readonly assessment: OmegaAssessment;
    readonly readiness: ReturnType<OmegaReadinessEngineService["classify"]>;
  }> {
    const runtimeReport = await this.runtime.execute();

    const findings: OmegaFinding[] = runtimeReport.results
      .filter((result) => result.status === "fail" || result.status === "warn")
      .map((result) => ({
        id: `${result.pluginId}:${randomUUID()}`,
        source: result.pluginId,
        category: result.category,
        severity: this.mapSeverity(result.status, result.severity),
        title: result.name,
        description: result.message,
        evidence: result.evidence.map((evidence) => ({
          [evidence.key]: evidence.value,
        })),
        recommendations: result.recommendations.map(
          (recommendation) =>
            `${recommendation.title}: ${recommendation.description}`,
        ),
      }));

    const rankedFindings = this.riskEngine.rank(findings);
    const score = this.scoreEngine.calculate(rankedFindings);
    const ruleResult = this.ruleEngine.evaluate(rankedFindings);
    const policyResult = this.policyEngine.decide(score);

    const assessment: OmegaAssessment = {
      assessmentId: `OMEGA-ASSESS-${randomUUID()}`,
      generatedAt: new Date().toISOString(),
      version: "2.0.0-omega.1",
      score,
      decision: policyResult.decision,
      findings: rankedFindings,
      rulesEvaluated: ruleResult.evaluated,
      policiesEvaluated: policyResult.evaluated,
      humanFinalAuthority: true,
    };

    this.history.append(assessment);

    return {
      assessment,
      readiness: this.readinessEngine.classify(score),
    };
  }

  private mapSeverity(
    status: string,
    severity: string,
  ): OmegaSeverity {
    if (status === "fail" && severity === "required") {
      return "critical";
    }

    if (status === "fail") {
      return "high";
    }

    if (severity === "required") {
      return "medium";
    }

    return "low";
  }
}
