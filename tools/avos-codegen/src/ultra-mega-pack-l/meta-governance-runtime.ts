import { UltraLFinding, UltraLSeverity } from "./contracts";

export interface GovernanceConstitution {
  key: string;
  authority: number;
  mandatory: boolean;
  principles: string[];
  controls: string[];
}

export interface MetaGovernanceDecision {
  approved: boolean;
  score: number;
  appliedConstitutions: string[];
  controls: string[];
  conflicts: string[];
  findings: UltraLFinding[];
  decidedAt: string;
}

export class AvosMetaGovernanceRuntime {
  decide(
    constitutions: readonly GovernanceConstitution[],
  ): MetaGovernanceDecision {
    const ranked = [...constitutions].sort(
      (a, b) => b.authority - a.authority,
    );

    const controls = Array.from(
      new Set(ranked.flatMap((constitution) => constitution.controls)),
    );

    const principleOwners = new Map<string, string[]>();

    for (const constitution of ranked) {
      for (const principle of constitution.principles) {
        const owners = principleOwners.get(principle) ?? [];
        owners.push(constitution.key);
        principleOwners.set(principle, owners);
      }
    }

    const conflicts = Array.from(principleOwners.entries())
      .filter(([, owners]) => owners.length > 2)
      .map(([principle]) => principle);

    const score =
      constitutions.length === 0
        ? 0
        : Math.max(
            0,
            Math.min(
              100,
              Math.round(
                constitutions.reduce(
                  (sum, constitution) => sum + constitution.authority,
                  0,
                ) / constitutions.length - conflicts.length * 10,
              ),
            ),
          );

    const mandatoryPresent = constitutions.some(
      (constitution) => constitution.mandatory,
    );

    const findings: UltraLFinding[] = conflicts.map((principle) => ({
      code: "META_GOVERNANCE_PRINCIPLE_CONFLICT",
      severity: UltraLSeverity.WARNING,
      message: `Principle ${principle} is defined by multiple constitutions.`,
      subject: principle,
      metadata: {
        constitutions: principleOwners.get(principle) ?? [],
      },
    }));

    return {
      approved: mandatoryPresent && score >= 70 && conflicts.length < 3,
      score,
      appliedConstitutions: ranked.map((constitution) => constitution.key),
      controls,
      conflicts,
      findings,
      decidedAt: new Date().toISOString(),
    };
  }
}
