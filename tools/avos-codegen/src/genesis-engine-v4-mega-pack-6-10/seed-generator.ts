import {
  V4DatabaseDomain,
  V4SeedRecord,
} from "./contracts";
import { v4Pascal } from "./name-utils";

export class V4SeedGenerator {
  generate(domains: readonly V4DatabaseDomain[]): V4SeedRecord[] {
    return domains.map((domain) => ({
      model: v4Pascal(domain.entityName),
      values: Object.fromEntries(
        domain.fields.map((field) => [
          field.name,
          this.sampleValue(field.name, field.type),
        ]),
      ),
    }));
  }

  private sampleValue(
    name: string,
    type: "string" | "number" | "boolean" | "date",
  ): string | number | boolean {
    if (type === "number") return 100;
    if (type === "boolean") return true;
    if (type === "date") return "2026-01-01T00:00:00.000Z";
    return `sample-${name}`;
  }
}
