import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  AvosFactoryCoreCompletionValidationCheck,
  AvosFactoryCoreCompletionValidationReport
} from "./avos-factory-core-completion.contracts";
import {
  AvosFactoryCertificateRegistryService
} from "./avos-factory-certificate-registry.service";
import {
  AvosFactoryDeploymentPlanService
} from "./avos-factory-deployment-plan.service";
import {
  AvosFactoryDeploymentExecutionService
} from "./avos-factory-deployment-execution.service";
import {
  AvosFactoryReleaseHealthService
} from "./avos-factory-release-health.service";
import {
  AvosFactoryReleaseIntelligenceService
} from "./avos-factory-release-intelligence.service";
import {
  AvosFactoryContinuousImprovementService
} from "./avos-factory-continuous-improvement.service";
import {
  AvosFactoryReleaseLearningMemoryService
} from "./avos-factory-release-learning-memory.service";
import {
  AvosFactoryAuditService
} from "./avos-factory-audit.service";

@Injectable()
export class AvosFactoryCoreCompletionValidationService {
  private readonly reports: AvosFactoryCoreCompletionValidationReport[] = [];

  constructor(
    private readonly certificates: AvosFactoryCertificateRegistryService,
    private readonly plans: AvosFactoryDeploymentPlanService,
    private readonly executions: AvosFactoryDeploymentExecutionService,
    private readonly health: AvosFactoryReleaseHealthService,
    private readonly intelligence: AvosFactoryReleaseIntelligenceService,
    private readonly improvements: AvosFactoryContinuousImprovementService,
    private readonly memory: AvosFactoryReleaseLearningMemoryService,
    private readonly audit: AvosFactoryAuditService
  ) {}

  run(input: {
    subjectId: string;
    version: string;
    actor: string;
  }): AvosFactoryCoreCompletionValidationReport {
    const certificate = this.certificates
      .list(1000)
      .find(
        (candidate) =>
          candidate.subjectId === input.subjectId &&
          candidate.version === input.version &&
          candidate.status === "certified"
      );

    const plans = this.plans
      .list(1000)
      .filter(
        (candidate) =>
          candidate.subjectId === input.subjectId &&
          candidate.version === input.version
      );

    const planIds = new Set(plans.map((plan) => plan.id));

    const executions = this.executions
      .listExecutions(1000)
      .filter((execution) => planIds.has(execution.planId));

    const executionIds = new Set(
      executions.map((execution) => execution.id)
    );

    const healthReports = this.health
      .list(1000)
      .filter((report) =>
        executionIds.has(report.deploymentExecutionId)
      );

    const intelligenceReports = this.intelligence
      .list(1000)
      .filter((report) =>
        executionIds.has(report.deploymentExecutionId)
      );

    const improvementActions = this.improvements
      .list(2000)
      .filter((action) => planIds.has(action.deploymentPlanId));

    const memoryRecords = this.memory
      .list(2000)
      .filter(
        (record) =>
          record.subjectId === input.subjectId &&
          record.version === input.version
      );

    const latestHealth = healthReports[0];
    const latestIntelligence = intelligenceReports[0];

    const checks: AvosFactoryCoreCompletionValidationCheck[] = [
      {
        name: "certificationFoundation",
        passed: Boolean(certificate),
        weight: 15,
        details: certificate
          ? "Factory certification is active."
          : "Factory certification is missing."
      },
      {
        name: "deploymentGovernance",
        passed:
          plans.length > 0 &&
          plans.some(
            (plan) =>
              plan.humanApproved &&
              Boolean(plan.approvedBy)
          ),
        weight: 15,
        details:
          plans.length > 0
            ? `${plans.length} deployment plan(s) found.`
            : "No deployment plans found."
      },
      {
        name: "deploymentExecution",
        passed:
          executions.length > 0 &&
          executions.some(
            (execution) =>
              execution.status === "completed" ||
              execution.status === "rolled-back"
          ),
        weight: 15,
        details:
          executions.length > 0
            ? `${executions.length} deployment execution(s) found.`
            : "No deployment executions found."
      },
      {
        name: "releaseHealth",
        passed:
          Boolean(latestHealth) &&
          latestHealth.score >= 85 &&
          latestHealth.level !== "critical",
        weight: 15,
        details: latestHealth
          ? `Latest release health score: ${latestHealth.score}.`
          : "No release health report found."
      },
      {
        name: "releaseIntelligence",
        passed:
          Boolean(latestIntelligence) &&
          latestIntelligence.score >= 85 &&
          latestIntelligence.level !== "high-risk",
        weight: 15,
        details: latestIntelligence
          ? `Latest release intelligence score: ${latestIntelligence.score}.`
          : "No release intelligence report found."
      },
      {
        name: "continuousImprovement",
        passed: improvementActions.length > 0,
        weight: 10,
        details:
          improvementActions.length > 0
            ? `${improvementActions.length} improvement action(s) found.`
            : "No improvement actions found."
      },
      {
        name: "releaseLearningMemory",
        passed: memoryRecords.length > 0,
        weight: 10,
        details:
          memoryRecords.length > 0
            ? `${memoryRecords.length} release learning memory record(s) found.`
            : "No release learning memory records found."
      },
      {
        name: "humanFinalAuthority",
        passed:
          plans.some(
            (plan) =>
              plan.humanApproved &&
              Boolean(plan.approvedBy)
          ),
        weight: 5,
        details:
          plans.some(
            (plan) =>
              plan.humanApproved &&
              Boolean(plan.approvedBy)
          )
            ? "Human Final Authority evidence is present."
            : "Human Final Authority evidence is missing."
      }
    ];

    const score = Math.round(
      checks.reduce(
        (total, check) =>
          total + (check.passed ? check.weight : 0),
        0
      )
    );

    const blockingFindings = checks
      .filter((check) => !check.passed)
      .map((check) => check.name);

    const report: AvosFactoryCoreCompletionValidationReport = {
      id: randomUUID(),
      subjectId: input.subjectId,
      version: input.version,
      status:
        score === 100 && blockingFindings.length === 0
          ? "passed"
          : "failed",
      score,
      checks,
      blockingFindings,
      validatedBy: input.actor,
      generatedAt: new Date().toISOString()
    };

    this.reports.unshift(report);

    this.audit.append({
      category: "verification",
      action: "factory-final-validation-completed",
      actor: input.actor,
      success: report.status === "passed",
      resourceId: report.id,
      details: {
        subjectId: input.subjectId,
        version: input.version,
        score,
        blockingFindings
      }
    });

    return structuredClone(report);
  }

  get(id: string): AvosFactoryCoreCompletionValidationReport | undefined {
    const report = this.reports.find((candidate) => candidate.id === id);
    return report ? structuredClone(report) : undefined;
  }

  latest(): AvosFactoryCoreCompletionValidationReport | undefined {
    const report = this.reports[0];
    return report ? structuredClone(report) : undefined;
  }

  list(limit = 100): AvosFactoryCoreCompletionValidationReport[] {
    return this.reports
      .slice(0, Math.max(1, Math.min(limit, 1000)))
      .map((report) => structuredClone(report));
  }
}
