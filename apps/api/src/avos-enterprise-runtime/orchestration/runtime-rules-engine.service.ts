import { Injectable } from '@nestjs/common';

export interface RuntimeRule {
  id: string;
  priority: number;
  evaluate: (context: Record<string, unknown>) => boolean;
  outcome: Record<string, unknown>;
}

@Injectable()
export class RuntimeRulesEngineService {
  private readonly rules: RuntimeRule[] = [];

  register(rule: RuntimeRule): void {
    this.rules.push(rule);
    this.rules.sort((a, b) => b.priority - a.priority);
  }

  evaluate(context: Record<string, unknown>): Record<string, unknown>[] {
    return this.rules
      .filter((rule) => rule.evaluate(context))
      .map((rule) => ({
        ruleId: rule.id,
        ...structuredClone(rule.outcome),
      }));
  }

  count(): number {
    return this.rules.length;
  }
}