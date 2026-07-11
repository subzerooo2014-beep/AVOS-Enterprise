import {
  CodeGenTemplateValue,
} from "../contracts/codegen-template-v2.contracts";

export class CodeGenTemplateExpressionResolverV2 {
  resolve(
    expression: string,
    scope:
      Record<
        string,
        CodeGenTemplateValue
      >,
  ): CodeGenTemplateValue |
    undefined {
    const normalized =
      expression.trim();

    if (!normalized) {
      return undefined;
    }

    if (
      normalized === "true"
    ) {
      return true;
    }

    if (
      normalized === "false"
    ) {
      return false;
    }

    if (
      normalized === "null"
    ) {
      return null;
    }

    if (
      /^-?\d+(?:\.\d+)?$/.test(
        normalized,
      )
    ) {
      return Number(
        normalized,
      );
    }

    const parts =
      normalized
        .split(".")
        .map(
          (part) =>
            part.trim(),
        )
        .filter(Boolean);

    let current:
      CodeGenTemplateValue |
      undefined =
      scope;

    for (const part of parts) {
      if (
        current === null ||
        typeof current !==
          "object" ||
        Array.isArray(
          current,
        )
      ) {
        return undefined;
      }

      current =
        current[part];
    }

    return current;
  }

  isTruthy(
    value:
      CodeGenTemplateValue |
      undefined,
  ): boolean {
    if (
      value === undefined ||
      value === null ||
      value === false
    ) {
      return false;
    }

    if (
      typeof value ===
      "string"
    ) {
      return value.length >
        0;
    }

    if (
      typeof value ===
      "number"
    ) {
      return value !== 0;
    }

    if (
      Array.isArray(
        value,
      )
    ) {
      return value.length >
        0;
    }

    return true;
  }

  stringify(
    value:
      CodeGenTemplateValue |
      undefined,
  ): string {
    if (
      value === undefined ||
      value === null
    ) {
      return "";
    }

    if (
      typeof value ===
        "string" ||
      typeof value ===
        "number" ||
      typeof value ===
        "boolean"
    ) {
      return String(value);
    }

    return JSON.stringify(
      value,
      null,
      2,
    );
  }
}
