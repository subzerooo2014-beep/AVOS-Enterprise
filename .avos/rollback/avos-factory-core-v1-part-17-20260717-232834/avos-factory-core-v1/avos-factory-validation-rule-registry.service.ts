import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  AvosFactoryValidationRule
} from "./avos-factory-validation.contracts";

@Injectable()
export class AvosFactoryValidationRuleRegistryService {
  private readonly rules: AvosFactoryValidationRule[] = [];

  constructor() {
    this.seedDefaults();
  }

  register(
    input: Omit<AvosFactoryValidationRule, "id" | "createdAt">
  ): AvosFactoryValidationRule {
    const existing = this.rules.find(
      (rule) => rule.name.toLowerCase() === input.name.toLowerCase()
    );

    if (existing) {
      return structuredClone(existing);
    }

    const rule: AvosFactoryValidationRule = {
      id: randomUUID(),
      ...input,
      threshold: Math.max(0, Math.min(100, Math.round(input.threshold))),
      createdAt: new Date().toISOString()
    };

    this.rules.push(rule);
    return structuredClone(rule);
  }

  list(enabledOnly = false): AvosFactoryValidationRule[] {
    return this.rules
      .filter((rule) => !enabledOnly || rule.enabled)
      .map((rule) => structuredClone(rule));
  }

  private seedDefaults(): void {
    const defaults: Array<
      Omit<AvosFactoryValidationRule, "id" | "createdAt">
    > = [
      ["Architecture baseline", "architecture", "Architecture quality must meet the enterprise baseline.", "critical", 80],
      ["Maintainability baseline", "maintainability", "Maintainability must remain acceptable.", "error", 75],
      ["Scalability baseline", "scalability", "Scalability must support future growth.", "error", 75],
      ["Security baseline", "security", "Security quality must meet the mandatory baseline.", "critical", 85],
      ["Documentation baseline", "documentation", "Documentation must be complete enough for governed operation.", "warning", 70],
      ["Reliability baseline", "reliability", "Reliability must support production operation.", "critical", 85],
      ["Capability reuse baseline", "reuse", "Capability First requires adequate reuse.", "warning", 70],
      ["Governance baseline", "governance", "Human Final Authority and audit controls must be preserved.", "critical", 100]
    ].map(([name, category, description, severity, threshold]) => ({
      name: name as string,
      category: category as AvosFactoryValidationRule["category"],
      description: description as string,
      severity: severity as AvosFactoryValidationRule["severity"],
      threshold: threshold as number,
      enabled: true,
      requiresHumanApproval: category === "governance"
    }));

    for (const rule of defaults) {
      this.register(rule);
    }
  }
}
