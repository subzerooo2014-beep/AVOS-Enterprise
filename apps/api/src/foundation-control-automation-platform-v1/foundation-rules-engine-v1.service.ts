import { Injectable } from "@nestjs/common";
import type { FoundationRuleV1 } from "./foundation-control-automation-v1.types";

@Injectable()
export class FoundationRulesEngineV1Service {
  private readonly rules = new Map<string, FoundationRuleV1>();

  upsert(
    input: Omit<FoundationRuleV1, "version" | "createdAt" | "updatedAt">,
  ): FoundationRuleV1 {
    const existing = this.rules.get(input.id);
    const now = new Date().toISOString();

    const rule: FoundationRuleV1 = {
      ...input,
      version: (existing?.version ?? 0) + 1,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };

    this.rules.set(rule.id, rule);
    return { ...rule };
  }

  evaluate(
    ruleId: string,
    input: Record<string, unknown>,
  ): { matched: boolean; rule: FoundationRuleV1 } {
    const rule = this.rules.get(ruleId);

    if (!rule || !rule.enabled) {
      return {
        matched: false,
        rule: rule ?? {
          id: ruleId,
          name: "missing",
          field: "",
          operator: "EQ",
          expected: undefined,
          enabled: false,
          version: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      };
    }

    const actual = input[rule.field];
    let matched = false;

    switch (rule.operator) {
      case "EQ": matched = actual === rule.expected; break;
      case "NEQ": matched = actual !== rule.expected; break;
      case "GT": matched = Number(actual) > Number(rule.expected); break;
      case "GTE": matched = Number(actual) >= Number(rule.expected); break;
      case "LT": matched = Number(actual) < Number(rule.expected); break;
      case "LTE": matched = Number(actual) <= Number(rule.expected); break;
      case "IN":
        matched = Array.isArray(rule.expected) && rule.expected.includes(actual);
        break;
    }

    return { matched, rule: { ...rule } };
  }

  list(): FoundationRuleV1[] {
    return Array.from(this.rules.values()).map((rule) => ({ ...rule }));
  }

  count(): number {
    return this.rules.size;
  }
}
