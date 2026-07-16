import { Injectable } from "@nestjs/common";
import type { BusinessRuleRecord } from "./enterprise-business-operations.types";

@Injectable()
export class BusinessRulesCenterService {
  private readonly rules = new Map<string, BusinessRuleRecord>();

  register(rule: BusinessRuleRecord): BusinessRuleRecord {
    this.rules.set(rule.id, {
      ...rule,
      conditions: { ...rule.conditions },
    });

    return {
      ...rule,
      conditions: { ...rule.conditions },
    };
  }

  list(domain?: string): BusinessRuleRecord[] {
    return Array.from(this.rules.values())
      .filter((rule) => (domain ? rule.domain === domain : true))
      .map((rule) => ({
        ...rule,
        conditions: { ...rule.conditions },
      }))
      .sort((a, b) => a.priority - b.priority);
  }

  evaluate(
    domain: string,
    context: Record<string, unknown>,
  ): BusinessRuleRecord[] {
    return this.list(domain).filter(
      (rule) =>
        rule.enabled &&
        Object.entries(rule.conditions).every(
          ([key, value]) => context[key] === value,
        ),
    );
  }

  count(): number {
    return this.rules.size;
  }
}
