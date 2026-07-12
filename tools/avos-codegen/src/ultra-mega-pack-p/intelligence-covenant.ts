import { UltraPFinding, UltraPSeverity } from "./contracts";

export interface IntelligenceMember {
  key: string;
  authority: number;
  reliability: number;
  alignment: number;
  controls: string[];
}

export interface IntelligenceCovenantResult {
  ratified: boolean;
  covenantScore: number;
  members: string[];
  controls: string[];
  findings: UltraPFinding[];
  ratifiedAt: string;
}

export class UniversalIntelligenceCovenant {
  ratify(members: readonly IntelligenceMember[]): IntelligenceCovenantResult {
    const controls = Array.from(new Set(members.flatMap((member) => member.controls)));

    const covenantScore =
      members.length === 0
        ? 0
        : Math.round(
            members.reduce(
              (sum, member) =>
                sum +
                member.authority * 0.35 +
                member.reliability * 0.35 +
                member.alignment * 0.3,
              0,
            ) / members.length,
          );

    const findings: UltraPFinding[] = [];

    for (const member of members) {
      if (member.alignment < 70) {
        findings.push({
          code: "INTELLIGENCE_COVENANT_ALIGNMENT_LOW",
          severity: UltraPSeverity.ERROR,
          message: `Member ${member.key} has insufficient alignment.`,
          subject: member.key,
          metadata: { alignment: member.alignment },
        });
      }
    }

    return {
      ratified:
        members.length >= 3 &&
        covenantScore >= 80 &&
        findings.length === 0,
      covenantScore,
      members: members.map((member) => member.key),
      controls,
      findings,
      ratifiedAt: new Date().toISOString(),
    };
  }
}
