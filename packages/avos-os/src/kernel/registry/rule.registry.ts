import { AvosRule } from "../contracts/rule";
import { AvosDecisionInput } from "../contracts/decision";

export class RuleRegistry {
  private readonly rules: AvosRule[] = [];

  register(rule: AvosRule) {
    this.rules.push(rule);
  }

  resolve(input: AvosDecisionInput): AvosRule[] {
    return this.rules.filter((rule) => rule.supports(input));
  }
}
