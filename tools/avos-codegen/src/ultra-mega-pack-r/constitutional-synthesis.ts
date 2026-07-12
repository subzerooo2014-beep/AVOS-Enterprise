import { UltraRFinding, UltraRSeverity } from "./contracts";

export interface ConstitutionalPrinciple {
  key: string;
  authority: number;
  mandatory: boolean;
  domain: string;
  controls: string[];
}

export interface ConstitutionalSynthesisResult {
  synthesized: boolean;
  constitutionScore: number;
  principles: string[];
  controls: string[];
  conflicts: string[];
  findings: UltraRFinding[];
  synthesizedAt: string;
}

export class AutonomousConstitutionalSynthesis {
  synthesize(
    principles: readonly ConstitutionalPrinciple[],
  ): ConstitutionalSynthesisResult {
    const grouped = new Map<string, ConstitutionalPrinciple[]>();

    for (const principle of principles) {
      const items = grouped.get(principle.domain) ?? [];
      items.push(principle);
      grouped.set(principle.domain, items);
    }

    const conflicts = Array.from(grouped.entries())
      .filter(([, items]) => items.filter((item) => item.mandatory).length > 2)
      .map(([domain]) => domain);

    const constitutionScore =
      principles.length === 0
        ? 0
        : Math.max(
            0,
            Math.min(
              100,
              Math.round(
                principles.reduce((sum, principle) => sum + principle.authority, 0) /
                  principles.length -
                  conflicts.length * 10,
              ),
            ),
          );

    const findings: UltraRFinding[] = conflicts.map((domain) => ({
      code: "CONSTITUTIONAL_SYNTHESIS_CONFLICT",
      severity: UltraRSeverity.WARNING,
      message: `Constitutional domain ${domain} has competing mandatory principles.`,
      subject: domain,
      metadata: {},
    }));

    return {
      synthesized:
        principles.some((principle) => principle.mandatory) &&
        constitutionScore >= 75 &&
        conflicts.length < 3,
      constitutionScore,
      principles: principles.map((principle) => principle.key),
      controls: Array.from(
        new Set(principles.flatMap((principle) => principle.controls)),
      ),
      conflicts,
      findings,
      synthesizedAt: new Date().toISOString(),
    };
  }
}
