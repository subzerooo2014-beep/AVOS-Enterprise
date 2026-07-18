import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  AvosFactoryValidationFinding,
  AvosFactoryValidationReport,
  AvosFactoryValidationRule
} from "./avos-factory-validation.contracts";
import {
  AvosFactoryValidationRuleRegistryService
} from "./avos-factory-validation-rule-registry.service";
import {
  AvosFactoryGenerationAnalyzerService
} from "./avos-factory-generation-analyzer.service";
import {
  AvosFactoryAuditService
} from "./avos-factory-audit.service";

@Injectable()
export class AvosFactoryValidationEngineService {
  private readonly reports: AvosFactoryValidationReport[] = [];

  constructor(
    private readonly rules: AvosFactoryValidationRuleRegistryService,
    private readonly analyzer: AvosFactoryGenerationAnalyzerService,
    private readonly audit: AvosFactoryAuditService
  ) {}

  validate(input: {
    subjectId: string;
    actor: string;
    governanceScore?: number;
  }): AvosFactoryValidationReport {
    const analyses = this.analyzer.findBySubject(input.subjectId);
    const latest = analyses[0];

    const values: Record<AvosFactoryValidationRule["category"], number> = {
      architecture: latest?.quality.architecture ?? 0,
      maintainability: latest?.quality.maintainability ?? 0,
      scalability: latest?.quality.scalability ?? 0,
      security: latest?.quality.security ?? 0,
      documentation: latest?.quality.documentation ?? 0,
      reliability: latest?.quality.reliability ?? 0,
      reuse: latest?.quality.reuse ?? 0,
      governance: Math.max(0, Math.min(100, input.governanceScore ?? 100))
    };

    const findings: AvosFactoryValidationFinding[] = [];
    let passedRules = 0;
    let failedRules = 0;

    for (const rule of this.rules.list(true)) {
      const actual = values[rule.category];
      const passed = actual >= rule.threshold;

      if (passed) {
        passedRules += 1;
      } else {
        failedRules += 1;
        findings.push({
          id: randomUUID(),
          ruleId: rule.id,
          subjectId: input.subjectId,
          category: rule.category,
          severity: rule.severity,
          status: "failed",
          message: `${rule.name} failed: ${actual} is below ${rule.threshold}.`,
          evidence: {
            actual,
            threshold: rule.threshold,
            description: rule.description
          },
          detectedAt: new Date().toISOString()
        });
      }
    }

    if (!latest) {
      findings.push({
        id: randomUUID(),
        ruleId: "system:analysis-required",
        subjectId: input.subjectId,
        category: "governance",
        severity: "critical",
        status: "failed",
        message: "No generation analysis exists for this subject.",
        evidence: {},
        detectedAt: new Date().toISOString()
      });
      failedRules += 1;
    }

    const enabledRules = this.rules.list(true);
    const score =
      enabledRules.length === 0
        ? 0
        : Math.round(
            enabledRules.reduce(
              (sum, rule) => sum + values[rule.category],
              0
            ) / enabledRules.length
          );

    const blockingFindings = findings.filter(
      (finding) =>
        finding.severity === "critical" ||
        finding.severity === "error"
    ).length;

    const warningFindings = findings.filter(
      (finding) => finding.severity === "warning"
    ).length;

    const report: AvosFactoryValidationReport = {
      id: randomUUID(),
      subjectId: input.subjectId,
      actor: input.actor,
      score,
      passed: blockingFindings === 0 && score >= 80,
      findings,
      blockingFindings,
      warningFindings,
      passedRules,
      failedRules,
      generatedAt: new Date().toISOString()
    };

    this.reports.unshift(report);

    this.audit.append({
      category: "verification",
      action: "factory-validation-completed",
      actor: input.actor,
      success: report.passed,
      resourceId: report.id,
      details: {
        subjectId: input.subjectId,
        score,
        blockingFindings
      }
    });

    return structuredClone(report);
  }

  list(limit = 100): AvosFactoryValidationReport[] {
    return this.reports
      .slice(0, Math.max(1, Math.min(limit, 1000)))
      .map((report) => structuredClone(report));
  }

  get(reportId: string): AvosFactoryValidationReport | undefined {
    const report = this.reports.find((candidate) => candidate.id === reportId);
    return report ? structuredClone(report) : undefined;
  }

  latestForSubject(subjectId: string): AvosFactoryValidationReport | undefined {
    const report = this.reports.find(
      (candidate) => candidate.subjectId === subjectId
    );
    return report ? structuredClone(report) : undefined;
  }
}
