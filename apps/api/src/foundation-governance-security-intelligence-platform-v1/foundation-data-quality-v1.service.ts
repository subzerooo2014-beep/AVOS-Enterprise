import { Injectable } from "@nestjs/common";
import type { FoundationDataQualityRuleV1 } from "./foundation-governance-security-intelligence-v1.types";

@Injectable()
export class FoundationDataQualityV1Service {
  private readonly rules = new Map<string, FoundationDataQualityRuleV1>();

  upsert(
    input: Omit<FoundationDataQualityRuleV1, "updatedAt">,
  ): FoundationDataQualityRuleV1 {
    const rule: FoundationDataQualityRuleV1 = {
      ...input,
      updatedAt: new Date().toISOString(),
    };

    this.rules.set(rule.id, rule);
    return { ...rule };
  }

  validate(
    dataset: string,
    record: Record<string, unknown>,
  ): { passed: boolean; failures: string[] } {
    const failures: string[] = [];
    const rules = this.list().filter(
      (rule) => rule.dataset === dataset && rule.enabled,
    );

    for (const rule of rules) {
      const value = record[rule.field];

      switch (rule.ruleType) {
        case "REQUIRED":
          if (value === null || value === undefined || value === "") {
            failures.push(`${rule.field} is required.`);
          }
          break;
        case "TYPE":
          if (typeof value !== String(rule.expected)) {
            failures.push(`${rule.field} type is invalid.`);
          }
          break;
        case "RANGE":
          if (
            typeof value !== "number" ||
            !Array.isArray(rule.expected) ||
            value < Number(rule.expected[0]) ||
            value > Number(rule.expected[1])
          ) {
            failures.push(`${rule.field} is outside the allowed range.`);
          }
          break;
        case "PATTERN":
          if (
            typeof value !== "string" ||
            typeof rule.expected !== "string" ||
            !new RegExp(rule.expected).test(value)
          ) {
            failures.push(`${rule.field} does not match the required pattern.`);
          }
          break;
        case "UNIQUENESS":
          break;
      }
    }

    return { passed: failures.length === 0, failures };
  }

  list(): FoundationDataQualityRuleV1[] {
    return Array.from(this.rules.values()).map((item) => ({ ...item }));
  }

  count(): number {
    return this.rules.size;
  }
}
