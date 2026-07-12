import { randomUUID } from "node:crypto";

export interface DomainModule {
  id: string;
  key: string;
  type: "core" | "supporting" | "integration" | "governance";
  responsibilities: string[];
  dependencies: string[];
}

export interface DomainDecompositionResult {
  modules: DomainModule[];
  dependencyDepth: number;
}

export class DomainDecomposer {
  decompose(domains: readonly string[]): DomainDecompositionResult {
    const modules = domains.map((domain, index): DomainModule => {
      const key = domain.toLowerCase().replace(/[^a-z0-9]+/g, "-");

      return {
        id: randomUUID(),
        key,
        type: index === 0 ? "core" : "supporting",
        responsibilities: [
          `manage-${key}`,
          `validate-${key}`,
          `publish-${key}-events`,
        ],
        dependencies: index === 0 ? [] : [domains[0]!.toLowerCase().replace(/[^a-z0-9]+/g, "-")],
      };
    });

    modules.push({
      id: randomUUID(),
      key: "governance",
      type: "governance",
      responsibilities: [
        "enforce-policies",
        "record-evidence",
        "coordinate-approvals",
      ],
      dependencies: modules.map((module) => module.key),
    });

    return {
      modules,
      dependencyDepth: Math.max(1, modules.length),
    };
  }
}
