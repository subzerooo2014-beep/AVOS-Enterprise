import { Injectable } from "@nestjs/common";
import { createHash } from "node:crypto";

@Injectable()
export class EnterpriseFingerprintService {
  create(value: unknown): string {
    return createHash("sha256")
      .update(this.stableStringify(value))
      .digest("hex");
  }

  private stableStringify(
    value: unknown,
  ): string {
    if (
      value === null ||
      typeof value !== "object"
    ) {
      return JSON.stringify(value);
    }

    if (Array.isArray(value)) {
      return `[${value
        .map((item) =>
          this.stableStringify(item),
        )
        .join(",")}]`;
    }

    const record =
      value as Record<string, unknown>;

    return `{${Object.keys(record)
      .sort()
      .map(
        (key) =>
          `${JSON.stringify(key)}:${this.stableStringify(
            record[key],
          )}`,
      )
      .join(",")}}`;
  }
}
