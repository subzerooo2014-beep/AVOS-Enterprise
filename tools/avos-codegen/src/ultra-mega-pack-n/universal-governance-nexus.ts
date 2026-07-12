import { UltraNFinding, UltraNSeverity } from "./contracts";

export interface GovernanceNexusRuntime {
  key: string;
  domain:
    | "identity"
    | "alliances"
    | "capital"
    | "knowledge"
    | "governance"
    | "operations";
  readiness: number;
  authority: number;
}

export interface UniversalGovernanceNexusResult {
  active: boolean;
  readinessScore: number;
  authorityScore: number;
  activeRuntimes: string[];
  missingDomains: string[];
  findings: UltraNFinding[];
  activatedAt: string;
}

export class AvosUniversalGovernanceNexus {
  activate(
    runtimes: readonly GovernanceNexusRuntime[],
  ): UniversalGovernanceNexusResult {
    const requiredDomains: GovernanceNexusRuntime["domain"][] = [
      "identity",
      "alliances",
      "capital",
      "knowledge",
      "governance",
      "operations",
    ];

    const domains = new Set(runtimes.map((runtime) => runtime.domain));
    const missingDomains = requiredDomains.filter(
      (domain) => !domains.has(domain),
    );

    const readinessScore =
      runtimes.length === 0
        ? 0
        : Math.round(
            runtimes.reduce((sum, runtime) => sum + runtime.readiness, 0) /
              runtimes.length,
          );

    const authorityScore =
      runtimes.length === 0
        ? 0
        : Math.round(
            runtimes.reduce((sum, runtime) => sum + runtime.authority, 0) /
              runtimes.length,
          );

    const findings: UltraNFinding[] = [];

    if (missingDomains.length > 0) {
      findings.push({
        code: "GOVERNANCE_NEXUS_DOMAIN_MISSING",
        severity: UltraNSeverity.ERROR,
        message: "One or more governance nexus domains are missing.",
        metadata: { missingDomains },
      });
    }

    if (readinessScore < 80 || authorityScore < 80) {
      findings.push({
        code: "GOVERNANCE_NEXUS_NOT_READY",
        severity: UltraNSeverity.WARNING,
        message: "Universal governance nexus is below readiness threshold.",
        metadata: { readinessScore, authorityScore },
      });
    }

    return {
      active:
        missingDomains.length === 0 &&
        readinessScore >= 80 &&
        authorityScore >= 80,
      readinessScore,
      authorityScore,
      activeRuntimes: runtimes.map((runtime) => runtime.key),
      missingDomains,
      findings,
      activatedAt: new Date().toISOString(),
    };
  }
}
