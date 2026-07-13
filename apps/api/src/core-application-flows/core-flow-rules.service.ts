import { BadRequestException, Injectable } from "@nestjs/common";

type RuleOperator =
  | "eq"
  | "neq"
  | "gt"
  | "gte"
  | "lt"
  | "lte"
  | "in"
  | "contains";

@Injectable()
export class CoreFlowRulesService {
  evaluate(rule: any, context: Record<string, unknown>) {
    const field = String(rule?.field ?? "");
    const operator = String(rule?.operator ?? "eq") as RuleOperator;
    const expected = rule?.value;
    const actual = context[field];

    switch (operator) {
      case "eq":
        return actual === expected;
      case "neq":
        return actual !== expected;
      case "gt":
        return Number(actual) > Number(expected);
      case "gte":
        return Number(actual) >= Number(expected);
      case "lt":
        return Number(actual) < Number(expected);
      case "lte":
        return Number(actual) <= Number(expected);
      case "in":
        return Array.isArray(expected) && expected.includes(actual);
      case "contains":
        return Array.isArray(actual)
          ? actual.includes(expected)
          : String(actual ?? "").includes(String(expected ?? ""));
      default:
        throw new BadRequestException(`Unsupported rule operator '${operator}'.`);
    }
  }

  evaluateAll(rules: any[], context: Record<string, unknown>) {
    const normalized = Array.isArray(rules) ? rules : [];
    const results = normalized.map((rule) => ({
      rule,
      passed: this.evaluate(rule, context),
    }));
    return {
      passed: results.every((item) => item.passed),
      results,
    };
  }

  evaluateAny(rules: any[], context: Record<string, unknown>) {
    const normalized = Array.isArray(rules) ? rules : [];
    const results = normalized.map((rule) => ({
      rule,
      passed: this.evaluate(rule, context),
    }));
    return {
      passed: results.some((item) => item.passed),
      results,
    };
  }
}
