import { Injectable } from "@nestjs/common";
import {
  JsonValue,
  ResiliencePolicyCondition,
} from "../contracts/runtime-resilience.contracts";

@Injectable()
export class ResiliencePolicyEvaluatorService {
  evaluateConditions(
    conditions: ResiliencePolicyCondition[],
    context: Record<string, unknown>,
  ): boolean {
    return conditions.every((condition) =>
      this.evaluateCondition(condition, context),
    );
  }

  private evaluateCondition(
    condition: ResiliencePolicyCondition,
    context: Record<string, unknown>,
  ): boolean {
    const actual = this.resolvePath(context, condition.field);
    const expected = condition.value;

    switch (condition.operator) {
      case "exists":
        return expected === false
          ? actual === undefined || actual === null
          : actual !== undefined && actual !== null;

      case "eq":
        return this.isEqual(actual, expected);

      case "neq":
        return !this.isEqual(actual, expected);

      case "gt":
        return this.toNumber(actual) > this.toNumber(expected);

      case "gte":
        return this.toNumber(actual) >= this.toNumber(expected);

      case "lt":
        return this.toNumber(actual) < this.toNumber(expected);

      case "lte":
        return this.toNumber(actual) <= this.toNumber(expected);

      case "in":
        return Array.isArray(expected)
          ? expected.some((value) => this.isEqual(actual, value))
          : false;

      case "not_in":
        return Array.isArray(expected)
          ? !expected.some((value) => this.isEqual(actual, value))
          : true;

      case "contains":
        if (typeof actual === "string") {
          return actual.includes(String(expected ?? ""));
        }

        if (Array.isArray(actual)) {
          return actual.some((item) =>
            this.isEqual(item, expected),
          );
        }

        return false;

      default:
        return false;
    }
  }

  private resolvePath(
    object: Record<string, unknown>,
    path: string,
  ): unknown {
    const parts = path.split(".").filter(Boolean);

    let current: unknown = object;

    for (const part of parts) {
      if (
        current === null ||
        current === undefined ||
        typeof current !== "object"
      ) {
        return undefined;
      }

      current = (current as Record<string, unknown>)[part];
    }

    return current;
  }

  private toNumber(value: unknown): number {
    const numberValue = Number(value);

    if (!Number.isFinite(numberValue)) {
      return Number.NaN;
    }

    return numberValue;
  }

  private isEqual(actual: unknown, expected: unknown): boolean {
    if (
      typeof actual === "number" ||
      typeof expected === "number"
    ) {
      const actualNumber = Number(actual);
      const expectedNumber = Number(expected);

      if (
        Number.isFinite(actualNumber) &&
        Number.isFinite(expectedNumber)
      ) {
        return actualNumber === expectedNumber;
      }
    }

    if (
      typeof actual === "object" &&
      actual !== null &&
      typeof expected === "object" &&
      expected !== null
    ) {
      return JSON.stringify(actual) === JSON.stringify(expected);
    }

    return actual === expected;
  }
}
