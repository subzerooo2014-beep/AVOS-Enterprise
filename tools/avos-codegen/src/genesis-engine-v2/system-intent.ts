import { GenesisFinding, GenesisSeverity, GenesisValue } from "./contracts";

export interface SystemIntent {
  systemKey: string;
  name: string;
  description: string;
  businessGoals: string[];
  targetUsers: string[];
  domains: string[];
  constraints: string[];
  nonFunctionalRequirements: Record<string, GenesisValue>;
}

export interface NormalizedSystemIntent {
  systemKey: string;
  slug: string;
  businessGoals: string[];
  targetUsers: string[];
  domains: string[];
  constraints: string[];
  complexityScore: number;
  findings: GenesisFinding[];
}

export class SystemIntentNormalizer {
  normalize(input: SystemIntent): NormalizedSystemIntent {
    const findings: GenesisFinding[] = [];

    if (input.businessGoals.length === 0) {
      findings.push({
        code: "GENESIS_BUSINESS_GOALS_MISSING",
        severity: GenesisSeverity.ERROR,
        message: "At least one business goal is required.",
        metadata: {},
      });
    }

    if (input.domains.length === 0) {
      findings.push({
        code: "GENESIS_DOMAINS_MISSING",
        severity: GenesisSeverity.ERROR,
        message: "At least one domain is required.",
        metadata: {},
      });
    }

    const complexityScore = Math.max(
      1,
      Math.min(
        100,
        input.domains.length * 12 +
          input.businessGoals.length * 6 +
          input.constraints.length * 4 +
          Object.keys(input.nonFunctionalRequirements).length * 5,
      ),
    );

    return {
      systemKey: input.systemKey,
      slug: input.name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, ""),
      businessGoals: [...input.businessGoals],
      targetUsers: [...input.targetUsers],
      domains: [...new Set(input.domains)],
      constraints: [...new Set(input.constraints)],
      complexityScore,
      findings,
    };
  }
}
