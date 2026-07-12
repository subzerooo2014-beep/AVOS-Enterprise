import { UltraOFinding, UltraOSeverity } from "./contracts";

export interface TreatyParty {
  key: string;
  authority: number;
  trust: number;
  obligations: string[];
}

export interface TreatyProposal {
  key: string;
  requiredObligations: string[];
  minimumAuthority: number;
  minimumTrust: number;
}

export interface TreatyResult {
  ratified: boolean;
  score: number;
  participatingParties: string[];
  missingObligations: string[];
  findings: UltraOFinding[];
  ratifiedAt: string;
}

export class AutonomousTreatyEngine {
  negotiate(parties: readonly TreatyParty[], proposal: TreatyProposal): TreatyResult {
    const eligible = parties.filter(
      (party) =>
        party.authority >= proposal.minimumAuthority &&
        party.trust >= proposal.minimumTrust,
    );

    const covered = new Set(eligible.flatMap((party) => party.obligations));
    const missingObligations = proposal.requiredObligations.filter(
      (obligation) => !covered.has(obligation),
    );

    const score =
      eligible.length === 0
        ? 0
        : Math.round(
            eligible.reduce((sum, party) => sum + party.authority * 0.5 + party.trust * 0.5, 0) /
              eligible.length,
          );

    const findings: UltraOFinding[] = missingObligations.map((obligation) => ({
      code: "TREATY_OBLIGATION_MISSING",
      severity: UltraOSeverity.ERROR,
      message: `Treaty obligation ${obligation} is not covered.`,
      subject: obligation,
      metadata: {},
    }));

    return {
      ratified: eligible.length >= 2 && missingObligations.length === 0 && score >= 75,
      score,
      participatingParties: eligible.map((party) => party.key),
      missingObligations,
      findings,
      ratifiedAt: new Date().toISOString(),
    };
  }
}
