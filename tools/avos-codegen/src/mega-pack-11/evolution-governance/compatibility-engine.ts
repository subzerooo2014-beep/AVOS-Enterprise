import {
  BlueprintCompatibilityFinding,
  BlueprintCompatibilityReport,
  EvolutionProposal,
} from "./contracts";

export interface BlueprintVersionProvider {
  getVersion(
    blueprintKey: string,
  ): string | undefined;
}

export interface BlueprintRequirementProvider {
  getRequiredVersion(
    proposalKey: string,
    blueprintKey: string,
  ): string | undefined;
}

export class EvolutionBlueprintCompatibilityEngine {
  constructor(
    readonly versions:
      BlueprintVersionProvider,
    readonly requirements:
      BlueprintRequirementProvider,
  ) {}

  evaluate(
    proposal: EvolutionProposal,
  ): BlueprintCompatibilityReport {
    const findings:
      BlueprintCompatibilityFinding[] =
      proposal.affectedBlueprints.map(
        (blueprintKey) => {
          const currentVersion =
            this.versions.getVersion(
              blueprintKey,
            );

          const requiredVersion =
            this.requirements.getRequiredVersion(
              proposal.key,
              blueprintKey,
            );

          const reasons: string[] = [];

          if (!currentVersion) {
            reasons.push(
              "Blueprint is not installed.",
            );
          }

          if (
            requiredVersion &&
            currentVersion &&
            !this.isCompatible(
              currentVersion,
              requiredVersion,
            )
          ) {
            reasons.push(
              `Blueprint version ${currentVersion} does not satisfy ${requiredVersion}.`,
            );
          }

          const compatible =
            Boolean(currentVersion) &&
            reasons.length === 0;

          return {
            blueprintKey,
            compatible,
            ...(requiredVersion
              ? { requiredVersion }
              : {}),
            ...(currentVersion
              ? { currentVersion }
              : {}),
            reasons,
          };
        },
      );

    return {
      proposalId: proposal.id,
      compatible:
        findings.every(
          (finding) =>
            finding.compatible,
        ),
      findings,
      generatedAt:
        new Date().toISOString(),
    };
  }

  private isCompatible(
    currentVersion: string,
    requiredVersion: string,
  ): boolean {
    const current =
      this.parseVersion(
        currentVersion,
      );

    const required =
      this.parseVersion(
        requiredVersion,
      );

    if (!current || !required) {
      return currentVersion === requiredVersion;
    }

    if (current.major !== required.major) {
      return current.major > required.major;
    }

    if (current.minor !== required.minor) {
      return current.minor > required.minor;
    }

    return current.patch >= required.patch;
  }

  private parseVersion(
    value: string,
  ):
    | {
        major: number;
        minor: number;
        patch: number;
      }
    | undefined {
    const match =
      value.match(
        /^(\d+)\.(\d+)\.(\d+)/,
      );

    if (!match) {
      return undefined;
    }

    return {
      major: Number(match[1]),
      minor: Number(match[2]),
      patch: Number(match[3]),
    };
  }
}
