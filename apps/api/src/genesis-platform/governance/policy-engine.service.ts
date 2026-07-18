import { Injectable } from "@nestjs/common";
import { GenesisBlueprint } from "../types/genesis-platform.types";

@Injectable()
export class GenesisPolicyEngineService {
  evaluate(blueprint: GenesisBlueprint): {
    passed: boolean;
    enforcedPolicies: string[];
    violations: string[];
  } {
    const enforcedPolicies = [
      "foundation-first",
      "blueprint-driven",
      "human-final-authority",
      "audit-by-design",
      ...blueprint.policies,
    ];

    const violations: string[] = [];
    if (blueprint.metadata["autonomousExecutionEnabled"] === true) {
      violations.push("Autonomous execution cannot be enabled in this pack.");
    }

    return {
      passed: violations.length === 0,
      enforcedPolicies: [...new Set(enforcedPolicies)],
      violations,
    };
  }
}
