import { Injectable } from "@nestjs/common";
import {
  ArchitectureAnalysisReport,
  ArchitectureFinding,
  RiskLevel,
} from "../contracts/architecture-intelligence.contracts";
import { ArchitectureRegistryService } from "./architecture-registry.service";
import { ArchitectureRulesService } from "./architecture-rules.service";

@Injectable()
export class ArchitectureAnalysisService {
  constructor(
    private readonly registry: ArchitectureRegistryService,
    private readonly rules: ArchitectureRulesService,
  ) {}

  analyze(): ArchitectureAnalysisReport {
    const components = this.registry.list();
    const findings = [...this.rules.evaluate(components)];

    findings.push(...this.detectDrift());
    findings.push(...this.detectCompatibilityRisks());
    findings.push(...this.detectTechnicalDebt());
    findings.push(...this.detectCouplingRisks());

    const critical = findings.filter((finding) => finding.severity === "critical").length;
    const errors = findings.filter((finding) => finding.severity === "error").length;
    const warnings = findings.filter((finding) => finding.severity === "warning").length;

    const score = Math.max(0, 100 - critical * 25 - errors * 12 - warnings * 5);
    const status = score >= 85 ? "healthy" : score >= 65 ? "degraded" : "critical";
    const riskLevel: RiskLevel =
      critical > 0 ? "critical" :
      errors > 0 ? "high" :
      warnings > 0 ? "medium" :
      "low";

    const upgradeReadinessScore = Math.max(
      0,
      100 - findings.filter((finding) =>
        finding.ruleKey.includes("compatibility") ||
        finding.ruleKey.includes("technical-debt") ||
        finding.ruleKey.includes("coupling"),
      ).length * 10,
    );

    return {
      id: `architecture-analysis:${Date.now()}`,
      score,
      status,
      architectureComponents: components.length,
      activeComponents: components.filter((component) => component.status === "active").length,
      dependencyLinks: this.registry.dependencyCount(),
      driftFindings: findings.filter((finding) => finding.ruleKey.includes("drift")).length,
      compatibilityFindings: findings.filter((finding) => finding.ruleKey.includes("compatibility")).length,
      technicalDebtFindings: findings.filter((finding) => finding.ruleKey.includes("technical-debt")).length,
      couplingFindings: findings.filter((finding) => finding.ruleKey.includes("coupling")).length,
      upgradeReadinessScore,
      riskLevel,
      findings,
      recommendations: this.recommend(findings),
      generatedAt: new Date().toISOString(),
    };
  }

  private detectDrift(): readonly ArchitectureFinding[] {
    const findings: ArchitectureFinding[] = [];

    for (const component of this.registry.list()) {
      if (component.status === "active" && component.version.trim() === "") {
        findings.push(this.finding(
          component.id,
          "architecture-drift-version",
          "error",
          "Version drift detected",
          `${component.name} has no declared version.`,
          "Declare and govern the component version.",
        ));
      }
    }

    return findings;
  }

  private detectCompatibilityRisks(): readonly ArchitectureFinding[] {
    const findings: ArchitectureFinding[] = [];
    const ids = new Set(this.registry.list().map((component) => component.id));

    for (const component of this.registry.list()) {
      for (const dependencyId of component.dependencies) {
        if (!ids.has(dependencyId)) {
          findings.push(this.finding(
            component.id,
            "compatibility-missing-dependency",
            "critical",
            "Missing dependency component",
            `${component.name} references a dependency that is not registered.`,
            "Register the dependency or remove the invalid reference.",
          ));
        }
      }
    }

    return findings;
  }

  private detectTechnicalDebt(): readonly ArchitectureFinding[] {
    const findings: ArchitectureFinding[] = [];

    for (const component of this.registry.list()) {
      if (component.status === "deprecated") {
        findings.push(this.finding(
          component.id,
          "technical-debt-deprecated-component",
          "warning",
          "Deprecated component remains registered",
          `${component.name} is deprecated and should have a retirement plan.`,
          "Create and approve a governed retirement or replacement plan.",
        ));
      }
    }

    return findings;
  }

  private detectCouplingRisks(): readonly ArchitectureFinding[] {
    const findings: ArchitectureFinding[] = [];

    for (const component of this.registry.list()) {
      if (component.dependencies.length > 7) {
        findings.push(this.finding(
          component.id,
          "coupling-excessive-dependencies",
          "warning",
          "Excessive dependency coupling",
          `${component.name} has ${component.dependencies.length} direct dependencies.`,
          "Introduce stable contracts, facades, or orchestration boundaries.",
        ));
      }
    }

    return findings;
  }

  private recommend(findings: readonly ArchitectureFinding[]): readonly string[] {
    if (findings.length === 0) {
      return [
        "Architecture is aligned with the active rules.",
        "Continue governed evolution with impact analysis before structural changes.",
        "Preserve human final authority for high-impact architecture decisions.",
      ];
    }

    return [...new Set(findings.map((finding) => finding.remediation))];
  }

  private finding(
    componentId: string | undefined,
    ruleKey: string,
    severity: ArchitectureFinding["severity"],
    title: string,
    description: string,
    remediation: string,
  ): ArchitectureFinding {
    return {
      id: `architecture-finding:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`,
      componentId,
      ruleKey,
      severity,
      title,
      description,
      remediation,
      detectedAt: new Date().toISOString(),
    };
  }
}