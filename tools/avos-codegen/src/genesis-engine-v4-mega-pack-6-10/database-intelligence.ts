import {
  V4DatabaseInput,
  V4DatabasePolicy,
} from "./contracts";
import { v4Pascal } from "./name-utils";

export interface V4QueryOptimizationHint {
  model: string;
  hint: string;
  priority: "low" | "medium" | "high";
}

export class V4DatabaseIntelligence {
  policies(
    input: V4DatabaseInput,
  ): V4DatabasePolicy[] {
    return input.domains.flatMap((domain) => {
      const model = v4Pascal(domain.entityName);
      const policies: V4DatabasePolicy[] = [
        {
          key: `${domain.key}.audit-fields`,
          model,
          rule: "mutations must preserve audit metadata",
          enforcement: "both",
        },
      ];

      if (input.enableSoftDelete !== false) {
        policies.push({
          key: `${domain.key}.soft-delete`,
          model,
          rule: "records must be soft deleted by default",
          enforcement: "application",
        });
      }

      if (domain.fields.some((field) => field.unique)) {
        policies.push({
          key: `${domain.key}.unique-integrity`,
          model,
          rule: "unique fields must remain conflict-free",
          enforcement: "database",
        });
      }

      return policies;
    });
  }

  optimizationHints(
    input: V4DatabaseInput,
  ): V4QueryOptimizationHint[] {
    return input.domains.flatMap((domain) => {
      const model = v4Pascal(domain.entityName);
      const hints: V4QueryOptimizationHint[] = [];

      if (
        domain.fields.some((field) =>
          ["price", "amount", "total", "score"].includes(
            field.name.toLowerCase(),
          ),
        )
      ) {
        hints.push({
          model,
          hint: "consider composite index for numeric range queries",
          priority: "medium",
        });
      }

      if (
        domain.fields.some((field) =>
          ["status", "active", "published", "available"].includes(
            field.name.toLowerCase(),
          ),
        )
      ) {
        hints.push({
          model,
          hint: "index operational status fields used in filtering",
          priority: "high",
        });
      }

      return hints;
    });
  }
}
