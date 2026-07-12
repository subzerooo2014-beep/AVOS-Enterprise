import { UltraKFinding, UltraKSeverity } from "./contracts";

export interface CivilizationEngine {
  key: string;
  domain:
    | "economy"
    | "capabilities"
    | "funding"
    | "innovation"
    | "governance"
    | "operations";
  readiness: number;
  autonomy: number;
  dependencies: string[];
}

export interface EnterpriseCivilizationRuntimeResult {
  active: boolean;
  readinessScore: number;
  autonomyScore: number;
  activeEngines: string[];
  missingDomains: string[];
  findings: UltraKFinding[];
  activatedAt: string;
}

export class EnterpriseCivilizationRuntime {
  activate(
    engines: readonly CivilizationEngine[],
  ): EnterpriseCivilizationRuntimeResult {
    const requiredDomains: CivilizationEngine["domain"][] = [
      "economy",
      "capabilities",
      "funding",
      "innovation",
      "governance",
      "operations",
    ];

    const domains = new Set(engines.map((engine) => engine.domain));
    const missingDomains = requiredDomains.filter(
      (domain) => !domains.has(domain),
    );

    const readinessScore =
      engines.length === 0
        ? 0
        : Math.round(
            engines.reduce((sum, engine) => sum + engine.readiness, 0) /
              engines.length,
          );

    const autonomyScore =
      engines.length === 0
        ? 0
        : Math.round(
            engines.reduce((sum, engine) => sum + engine.autonomy, 0) /
              engines.length,
          );

    const findings: UltraKFinding[] = [];

    if (missingDomains.length > 0) {
      findings.push({
        code: "CIVILIZATION_DOMAIN_MISSING",
        severity: UltraKSeverity.ERROR,
        message: "One or more civilization runtime domains are missing.",
        metadata: { missingDomains },
      });
    }

    if (readinessScore < 75 || autonomyScore < 70) {
      findings.push({
        code: "CIVILIZATION_RUNTIME_NOT_READY",
        severity: UltraKSeverity.WARNING,
        message: "Enterprise civilization runtime readiness is below threshold.",
        metadata: { readinessScore, autonomyScore },
      });
    }

    return {
      active:
        missingDomains.length === 0 &&
        readinessScore >= 75 &&
        autonomyScore >= 70,
      readinessScore,
      autonomyScore,
      activeEngines: engines.map((engine) => engine.key),
      missingDomains,
      findings,
      activatedAt: new Date().toISOString(),
    };
  }
}
