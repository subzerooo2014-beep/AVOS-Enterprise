import { Injectable } from "@nestjs/common";
import { createHash } from "node:crypto";

@Injectable()
export class KnowledgeChecksumService {
  calculate(value: unknown): string {
    const normalized = this.stableStringify(value);
    return createHash("sha256").update(normalized).digest("hex");
  }

  private stableStringify(value: unknown): string {
    if (value === null || typeof value !== "object") {
      return JSON.stringify(value);
    }

    if (Array.isArray(value)) {
      return `[${value.map((item) => this.stableStringify(item)).join(",")}]`;
    }

    const record = value as Record<string, unknown>;
    const keys = Object.keys(record).sort();
    return `{${keys
      .map(
        (key) =>
          `${JSON.stringify(key)}:${this.stableStringify(record[key])}`,
      )
      .join(",")}}`;
  }
}