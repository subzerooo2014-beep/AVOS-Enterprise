import { Injectable } from "@nestjs/common";

@Injectable()
export class TemplateParserService {
  resolveValue(
    source: Record<string, unknown>,
    path: string
  ): unknown {
    const segments =
      path.split(".").filter(Boolean);

    let current: unknown = source;

    for (const segment of segments) {
      if (
        !current ||
        typeof current !== "object" ||
        Array.isArray(current)
      ) {
        return undefined;
      }

      current =
        (current as Record<string, unknown>)[segment];
    }

    return current;
  }

  stringifyValue(
    value: unknown
  ): string {
    if (
      value === null ||
      value === undefined
    ) {
      return "";
    }

    if (typeof value === "string") {
      return value;
    }

    if (
      typeof value === "number" ||
      typeof value === "boolean" ||
      typeof value === "bigint"
    ) {
      return String(value);
    }

    return JSON.stringify(
      value,
      null,
      2
    );
  }

  isTruthy(
    value: unknown
  ): boolean {
    if (Array.isArray(value)) {
      return value.length > 0;
    }

    return Boolean(value);
  }
}
