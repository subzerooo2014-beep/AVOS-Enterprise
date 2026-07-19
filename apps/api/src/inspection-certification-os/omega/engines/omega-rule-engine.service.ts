import { Injectable } from "@nestjs/common";
import { OmegaFinding, OmegaRule } from "../omega.types";

@Injectable()
export class OmegaRuleEngineService {
  private readonly rules: OmegaRule[] = [
    {
      id: "omega.rule.build-health",
      name: "Build Health",
      category: "build",
      severity: "critical",
      enabled: true,
      weight: 20,
      description: "Production build must remain healthy.",
    },
    {
      id: "omega.rule.typescript-health",
      name: "TypeScript Health",
      category: "quality",
      severity: "critical",
      enabled: true,
      weight: 20,
      description: "TypeScript compilation must succeed.",
    },
    {
      id: "omega.rule.prisma-health",
      name: "Prisma Health",
      category: "database",
      severity: "high",
      enabled: true,
      weight: 15,
      description: "Prisma schema must validate.",
    },
    {
      id: "omega.rule.security-baseline",
      name: "Security Baseline",
      category: "security",
      severity: "critical",
      enabled: true,
      weight: 20,
      description: "No critical security baseline violation is allowed.",
    },
    {
      id: "omega.rule.architecture-boundary",
      name: "Architecture Boundary",
      category: "architecture",
      severity: "high",
      enabled: true,
      weight: 15,
      description: "Inspection must remain non-destructive.",
    },
    {
      id: "omega.rule.documentation",
      name: "Documentation Baseline",
      category: "documentation",
      severity: "medium",
      enabled: true,
      weight: 10,
      description: "Repository documentation must exist.",
    },
  ];

  list(): readonly OmegaRule[] {
    return [...this.rules];
  }

  evaluate(findings: readonly OmegaFinding[]): {
    readonly evaluated: number;
    readonly failed: number;
    readonly passed: number;
  } {
    const active = this.rules.filter((rule) => rule.enabled);
    const failed = active.filter((rule) =>
      findings.some(
        (finding) =>
          finding.category === rule.category &&
          (finding.severity === "critical" || finding.severity === "high"),
      ),
    ).length;

    return {
      evaluated: active.length,
      failed,
      passed: active.length - failed,
    };
  }
}
