import { Injectable, NotFoundException } from "@nestjs/common";
import type {
  DataQualityResultRecord,
  DataQualityRuleRecord,
} from "./enterprise-data-foundation.types";

@Injectable()
export class DataQualityService {
  private readonly rules = new Map<string, DataQualityRuleRecord>();
  private readonly results: DataQualityResultRecord[] = [];

  registerRule(rule: DataQualityRuleRecord): DataQualityRuleRecord {
    this.rules.set(rule.id, {
      ...rule,
      configuration: { ...rule.configuration },
    });

    return {
      ...rule,
      configuration: { ...rule.configuration },
    };
  }

  check(
    ruleId: string,
    rows: Record<string, unknown>[],
  ): DataQualityResultRecord {
    const rule = this.rules.get(ruleId);

    if (!rule) {
      throw new NotFoundException(`Data quality rule '${ruleId}' was not found.`);
    }

    const passedRows = rows.filter((row) => this.evaluate(rule, row)).length;
    const score = rows.length === 0 ? 100 : (passedRows / rows.length) * 100;
    const result: DataQualityResultRecord = {
      id: `quality-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      ruleId,
      assetId: rule.assetId,
      passed: score === 100,
      score: Math.round(score * 100) / 100,
      message:
        score === 100
          ? "All rows passed the quality rule."
          : `${rows.length - passedRows} row(s) failed the quality rule.`,
      checkedAt: new Date().toISOString(),
    };

    this.results.unshift(result);

    if (this.results.length > 5000) {
      this.results.length = 5000;
    }

    return { ...result };
  }

  rulesList(): DataQualityRuleRecord[] {
    return Array.from(this.rules.values()).map((rule) => ({
      ...rule,
      configuration: { ...rule.configuration },
    }));
  }

  resultsList(): DataQualityResultRecord[] {
    return this.results.map((result) => ({ ...result }));
  }

  ruleCount(): number {
    return this.rules.size;
  }

  resultCount(): number {
    return this.results.length;
  }

  failureCount(): number {
    return this.results.filter((result) => !result.passed).length;
  }

  private evaluate(
    rule: DataQualityRuleRecord,
    row: Record<string, unknown>,
  ): boolean {
    const value = rule.field ? row[rule.field] : undefined;

    if (rule.type === "REQUIRED") {
      return value !== undefined && value !== null && value !== "";
    }

    if (rule.type === "RANGE") {
      const min = Number(rule.configuration["min"]);
      const max = Number(rule.configuration["max"]);
      const numeric = Number(value);
      return numeric >= min && numeric <= max;
    }

    if (rule.type === "PATTERN") {
      const pattern = String(rule.configuration["pattern"] ?? "");
      return new RegExp(pattern).test(String(value ?? ""));
    }

    return true;
  }
}
