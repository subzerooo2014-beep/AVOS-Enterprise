import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { ActionPlanGeneratorService } from "./action-plan-generator.service";
import { AutoFixPlannerService } from "./auto-fix-planner.service";
import { FindingRegistryService } from "./finding-registry.service";
import { IssueRegistryService } from "./issue-registry.service";
import {
  RemediationFinding,
  RemediationPlan,
  RemediationSeverity,
} from "./omega-remediation.types";
import { RecommendationEngineService } from "./recommendation-engine.service";
import { RiskPrioritizationEngineService } from "./risk-prioritization-engine.service";

@Injectable()
export class RemediationEngineService {
  private latestPlan: RemediationPlan | null = null;

  constructor(
    private readonly findings: FindingRegistryService,
    private readonly issues: IssueRegistryService,
    private readonly risk: RiskPrioritizationEngineService,
    private readonly recommendations: RecommendationEngineService,
    private readonly actionPlans: ActionPlanGeneratorService,
    private readonly autoFixPlanner: AutoFixPlannerService,
  ) {}

  createDemoFindings(): readonly RemediationFinding[] {
    const existing = this.findings.all();

    if (existing.length > 0) {
      return existing;
    }

    return [
      this.findings.register({
        source: "omega-intelligence",
        category: "architecture",
        title: "Unresolved dependency risk",
        description:
          "A dependency requires architectural review before certification.",
        severity: "high",
        evidenceIds: ["OMEGA-EVIDENCE-ARCHITECTURE"],
        metadata: {
          likelihood: 75,
          exposure: 65,
          businessImpact: 85,
        },
      }),
      this.findings.register({
        source: "omega-intelligence",
        category: "code-quality",
        title: "Maintainability threshold warning",
        description:
          "A code-quality threshold should be improved before the next release.",
        severity: "medium",
        evidenceIds: ["OMEGA-EVIDENCE-CODE-QUALITY"],
        metadata: {
          likelihood: 55,
          exposure: 45,
          businessImpact: 60,
        },
      }),
      this.findings.register({
        source: "omega-governance",
        category: "governance",
        title: "Pending human certification approval",
        description:
          "The certification decision requires final human approval.",
        severity: "low",
        evidenceIds: ["OMEGA-EVIDENCE-GOVERNANCE"],
        metadata: {
          likelihood: 100,
          exposure: 20,
          businessImpact: 35,
        },
      }),
    ];
  }

  plan(
    suppliedFindings?: readonly RemediationFinding[],
  ): {
    readonly plan: RemediationPlan;
    readonly autoFix: ReturnType<AutoFixPlannerService["plan"]>;
  } {
    const findings =
      suppliedFindings && suppliedFindings.length > 0
        ? suppliedFindings
        : this.createDemoFindings();

    const issues = findings.map((finding) => {
      const metadata = finding.metadata;

      const riskScore = this.risk.calculate({
        severity: finding.severity,
        likelihood: this.numberValue(metadata.likelihood),
        exposure: this.numberValue(metadata.exposure),
        businessImpact: this.numberValue(metadata.businessImpact),
      });

      return this.issues.create({
        findingId: finding.findingId,
        title: finding.title,
        severity: finding.severity,
        riskScore,
        tags: [finding.category, finding.source],
      });
    });

    const prioritizedIssues = this.risk.prioritize(issues);
    const recommendations = prioritizedIssues.map((issue) =>
      this.recommendations.generate(issue),
    );

    const actions = this.actionPlans.generate({
      issues: prioritizedIssues,
      recommendations,
    });

    const totalRisk = Number(
      (
        prioritizedIssues.reduce(
          (sum, issue) => sum + issue.riskScore,
          0,
        ) / Math.max(1, prioritizedIssues.length)
      ).toFixed(2),
    );

    const readinessScore = Number(
      Math.max(0, 100 - totalRisk * 0.55).toFixed(2),
    );

    const plan: RemediationPlan = {
      planId: `OMEGA-PLAN-${randomUUID()}`,
      createdAt: new Date().toISOString(),
      issueIds: prioritizedIssues.map((issue) => issue.issueId),
      recommendations,
      actions,
      totalRisk,
      readinessScore,
      governance: {
        humanFinalAuthority: true,
        autonomousFinalApproval: false,
        destructiveAutoFix: false,
        evidenceRequired: true,
      },
    };

    this.latestPlan = plan;

    return {
      plan,
      autoFix: this.autoFixPlanner.plan({
        issues: prioritizedIssues,
        actions,
      }),
    };
  }

  latest(): RemediationPlan | null {
    return this.latestPlan;
  }

  private numberValue(value: unknown): number | undefined {
    return typeof value === "number" ? value : undefined;
  }
}
