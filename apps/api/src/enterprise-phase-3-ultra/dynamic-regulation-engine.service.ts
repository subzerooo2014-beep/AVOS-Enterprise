import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { RegulationRule } from "./enterprise-phase-3-ultra.types";

@Injectable()
export class DynamicRegulationEngineService {
  private readonly rules: RegulationRule[] = [];

  register(jurisdiction: string, domain: string, rule: string): RegulationRule {
    const item: RegulationRule = {
      id: randomUUID(),
      jurisdiction,
      domain,
      rule,
      active: true,
    };

    this.rules.push(item);
    return item;
  }

  evaluate(jurisdiction: string, domain: string) {
    const matched = this.rules.filter(
      (rule) =>
        rule.active &&
        rule.jurisdiction === jurisdiction &&
        rule.domain === domain,
    );

    return {
      jurisdiction,
      domain,
      compliant: matched.length > 0,
      matchedRules: matched.length,
      evaluatedAt: new Date().toISOString(),
    };
  }

  count(): number {
    return this.rules.length;
  }
}