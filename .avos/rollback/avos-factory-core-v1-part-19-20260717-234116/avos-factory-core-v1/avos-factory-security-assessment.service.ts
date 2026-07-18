import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  AvosFactorySecurityAssessment,
  AvosFactorySecurityFinding
} from "./avos-factory-security.contracts";
import {
  AvosFactoryGenerationAnalyzerService
} from "./avos-factory-generation-analyzer.service";
import {
  AvosFactoryAuditService
} from "./avos-factory-audit.service";

@Injectable()
export class AvosFactorySecurityAssessmentService {
  private readonly assessments: AvosFactorySecurityAssessment[] = [];

  constructor(
    private readonly analyzer: AvosFactoryGenerationAnalyzerService,
    private readonly audit: AvosFactoryAuditService
  ) {}

  assess(input: {
    subjectId: string;
    actor: string;
    secretsDetected?: number;
    vulnerableDependencies?: number;
    insecureConfigurations?: number;
    privilegedOperations?: number;
    governanceScore?: number;
  }): AvosFactorySecurityAssessment {
    const analysis = this.analyzer.findBySubject(input.subjectId)[0];
    const findings: AvosFactorySecurityFinding[] = [];

    this.addFinding(
      findings,
      input.subjectId,
      "secret",
      input.secretsDetected ?? 0,
      "Hardcoded secrets detected",
      "Generated output contains hardcoded secrets."
    );

    this.addFinding(
      findings,
      input.subjectId,
      "dependency",
      input.vulnerableDependencies ?? 0,
      "Vulnerable dependencies detected",
      "Generated output contains vulnerable dependencies."
    );

    this.addFinding(
      findings,
      input.subjectId,
      "configuration",
      input.insecureConfigurations ?? 0,
      "Insecure configurations detected",
      "Generated output contains insecure configuration."
    );

    this.addFinding(
      findings,
      input.subjectId,
      "access",
      input.privilegedOperations ?? 0,
      "Privileged operations detected",
      "Generated output includes privileged operations requiring review."
    );

    const governanceScore = Math.max(
      0,
      Math.min(100, input.governanceScore ?? 100)
    );

    if (governanceScore < 100) {
      findings.push({
        id: randomUUID(),
        subjectId: input.subjectId,
        category: "governance",
        severity: governanceScore < 80 ? "critical" : "high",
        title: "Governance controls incomplete",
        description: "Human Final Authority or audit controls are incomplete.",
        evidence: { governanceScore },
        status: "open",
        detectedAt: new Date().toISOString()
      });
    }

    const baseSecurity = analysis?.quality.security ?? 0;
    const penalties = findings.reduce((sum, finding) => {
      const value =
        finding.severity === "critical"
          ? 30
          : finding.severity === "high"
            ? 20
            : finding.severity === "warning"
              ? 10
              : 2;

      return sum + value;
    }, 0);

    const score = Math.max(0, Math.min(100, baseSecurity - penalties));
    const criticalFindings = findings.filter(
      (finding) => finding.severity === "critical"
    ).length;
    const highFindings = findings.filter(
      (finding) => finding.severity === "high"
    ).length;

    const assessment: AvosFactorySecurityAssessment = {
      id: randomUUID(),
      subjectId: input.subjectId,
      score,
      passed: score >= 80 && criticalFindings === 0,
      findings,
      criticalFindings,
      highFindings,
      generatedAt: new Date().toISOString()
    };

    this.assessments.unshift(assessment);

    this.audit.append({
      category: "security",
      action: "factory-security-assessed",
      actor: input.actor,
      success: assessment.passed,
      resourceId: assessment.id,
      details: {
        subjectId: input.subjectId,
        score,
        criticalFindings,
        highFindings
      }
    });

    return structuredClone(assessment);
  }

  list(limit = 100): AvosFactorySecurityAssessment[] {
    return this.assessments
      .slice(0, Math.max(1, Math.min(limit, 1000)))
      .map((assessment) => structuredClone(assessment));
  }

  private addFinding(
    findings: AvosFactorySecurityFinding[],
    subjectId: string,
    category: AvosFactorySecurityFinding["category"],
    count: number,
    title: string,
    description: string
  ): void {
    if (count <= 0) {
      return;
    }

    findings.push({
      id: randomUUID(),
      subjectId,
      category,
      severity: count >= 3 ? "critical" : "high",
      title,
      description,
      evidence: { count },
      status: "open",
      detectedAt: new Date().toISOString()
    });
  }
}
