import { Injectable } from "@nestjs/common";
import {
  ArchitectureComponent,
  ArchitectureFinding,
  ArchitectureRule,
} from "../contracts/architecture-intelligence.contracts";

@Injectable()
export class ArchitectureRulesService {
  private readonly rules: readonly ArchitectureRule[] = [
    {
      id: "architecture-rule:unique-key",
      key: "unique-component-key",
      title: "Unique architecture component key",
      description: "Every component must have a unique architecture key.",
      severity: "critical",
      enabled: true,
      humanApprovalRequired: false,
    },
    {
      id: "architecture-rule:owner",
      key: "owner-required",
      title: "Architecture ownership required",
      description: "Every active component must have a responsible owner.",
      severity: "error",
      enabled: true,
      humanApprovalRequired: false,
    },
    {
      id: "architecture-rule:contracts",
      key: "contracts-required",
      title: "Architecture contracts required",
      description: "Every active component must expose at least one contract.",
      severity: "warning",
      enabled: true,
      humanApprovalRequired: false,
    },
    {
      id: "architecture-rule:human-authority",
      key: "human-final-authority",
      title: "Human final authority preserved",
      description: "Governed architectural changes require human approval.",
      severity: "critical",
      enabled: true,
      humanApprovalRequired: true,
    },
  ];

  list(): readonly ArchitectureRule[] {
    return this.rules;
  }

  evaluate(components: readonly ArchitectureComponent[]): readonly ArchitectureFinding[] {
    const findings: ArchitectureFinding[] = [];
    const keyCounts = new Map<string, number>();

    for (const component of components) {
      keyCounts.set(component.key, (keyCounts.get(component.key) ?? 0) + 1);

      if (component.status === "active" && !component.owner.trim()) {
        findings.push(this.createFinding(
          component.id,
          "owner-required",
          "error",
          "Missing architecture owner",
          `${component.name} has no responsible owner.`,
          "Assign an accountable architecture owner.",
        ));
      }

      if (component.status === "active" && component.contracts.length === 0) {
        findings.push(this.createFinding(
          component.id,
          "contracts-required",
          "warning",
          "Missing architecture contract",
          `${component.name} has no declared architecture contract.`,
          "Declare at least one stable architecture contract.",
        ));
      }
    }

    for (const [key, count] of keyCounts.entries()) {
      if (count > 1) {
        findings.push(this.createFinding(
          undefined,
          "unique-component-key",
          "critical",
          "Duplicate architecture key",
          `Architecture key ${key} is used ${count} times.`,
          "Rename duplicate architecture component keys.",
        ));
      }
    }

    return findings;
  }

  private createFinding(
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