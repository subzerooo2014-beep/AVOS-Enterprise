import { Injectable } from "@nestjs/common";
import type { IntelligenceRule } from "./enterprise-intelligence-control-plane.types";

@Injectable()
export class IntelligenceRuleRegistryService {
  private readonly rules = new Map<string, IntelligenceRule>();

  register(rule: IntelligenceRule): IntelligenceRule {
    this.rules.set(rule.id, { ...rule, condition: { ...rule.condition } });
    return { ...rule, condition: { ...rule.condition } };
  }

  list(domain?: string): IntelligenceRule[] {
    return Array.from(this.rules.values())
      .filter((rule) => (domain ? rule.domain === domain : true))
      .map((rule) => ({ ...rule, condition: { ...rule.condition } }))
      .sort((a, b) => a.priority - b.priority);
  }

  enabled(domain: string): IntelligenceRule[] {
    return this.list(domain).filter((rule) => rule.enabled);
  }

  count(): number {
    return this.rules.size;
  }
}
