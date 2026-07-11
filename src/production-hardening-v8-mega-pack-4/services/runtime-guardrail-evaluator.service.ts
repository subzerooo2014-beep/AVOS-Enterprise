import { Injectable } from "@nestjs/common";
import {
  RuntimeGuardrailCondition,
} from "../contracts";

@Injectable()
export class RuntimeGuardrailEvaluatorService {
  evaluateConditions(
    conditions:
      RuntimeGuardrailCondition[],
    context:
      Record<string, unknown>,
  ): boolean {
    return conditions.every(
      (condition) =>
        this.evaluateCondition(
          condition,
          context,
        ),
    );
  }

  private evaluateCondition(
    condition:
      RuntimeGuardrailCondition,
    context:
      Record<string, unknown>,
  ): boolean {
    const actual =
      this.resolvePath(
        context,
        condition.field,
      );

    const expected =
      condition.value;

    switch (condition.operator) {
      case "exists":
        return expected === false
          ? actual === undefined ||
            actual === null
          : actual !== undefined &&
            actual !== null;

      case "eq":
        return this.equal(
          actual,
          expected,
        );

      case "neq":
        return !this.equal(
          actual,
          expected,
        );

      case "gt":
        return (
          Number(actual) >
          Number(expected)
        );

      case "gte":
        return (
          Number(actual) >=
          Number(expected)
        );

      case "lt":
        return (
          Number(actual) <
          Number(expected)
        );

      case "lte":
        return (
          Number(actual) <=
          Number(expected)
        );

      case "in":
        return Array.isArray(
          expected,
        )
          ? expected.some(
              (item) =>
                this.equal(
                  actual,
                  item,
                ),
            )
          : false;

      case "not_in":
        return Array.isArray(
          expected,
        )
          ? !expected.some(
              (item) =>
                this.equal(
                  actual,
                  item,
                ),
            )
          : true;

      case "contains":
        if (
          typeof actual ===
          "string"
        ) {
          return actual.includes(
            String(
              expected ?? "",
            ),
          );
        }

        if (
          Array.isArray(actual)
        ) {
          return actual.some(
            (item) =>
              this.equal(
                item,
                expected,
              ),
          );
        }

        return false;

      default:
        return false;
    }
  }

  private resolvePath(
    value:
      Record<string, unknown>,
    path: string,
  ): unknown {
    const parts =
      path
        .split(".")
        .filter(Boolean);

    let current:
      unknown = value;

    for (const part of parts) {
      if (
        !current ||
        typeof current !==
          "object"
      ) {
        return undefined;
      }

      current =
        (
          current as Record<
            string,
            unknown
          >
        )[part];
    }

    return current;
  }

  private equal(
    actual: unknown,
    expected: unknown,
  ): boolean {
    if (
      typeof actual ===
        "number" ||
      typeof expected ===
        "number"
    ) {
      const actualNumber =
        Number(actual);

      const expectedNumber =
        Number(expected);

      if (
        Number.isFinite(
          actualNumber,
        ) &&
        Number.isFinite(
          expectedNumber,
        )
      ) {
        return (
          actualNumber ===
          expectedNumber
        );
      }
    }

    if (
      actual &&
      expected &&
      typeof actual ===
        "object" &&
      typeof expected ===
        "object"
    ) {
      return (
        JSON.stringify(actual) ===
        JSON.stringify(expected)
      );
    }

    return actual === expected;
  }
}
