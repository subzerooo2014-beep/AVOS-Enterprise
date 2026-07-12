import { UltraEFinding, UltraESeverity } from "./contracts";

export interface LegacySystem {
  key: string;
  version: string;
  runtime: string;
  criticality: number;
  dependencies: string[];
  dataFormats: string[];
}

export interface TargetPlatform {
  key: string;
  version: string;
  runtime: string;
  supportedFormats: string[];
}

export interface CompatibilityPlan {
  legacySystemKey: string;
  targetPlatformKey: string;
  compatibilityScore: number;
  adapters: string[];
  migrationSteps: string[];
  rollbackSteps: string[];
  findings: UltraEFinding[];
  generatedAt: string;
}

export class LegacyPreservationSystem {
  plan(
    legacy: LegacySystem,
    target: TargetPlatform,
  ): CompatibilityPlan {
    const findings: UltraEFinding[] = [];
    const unsupportedFormats = legacy.dataFormats.filter(
      (format) => !target.supportedFormats.includes(format),
    );

    const adapters = unsupportedFormats.map(
      (format) => `adapter-${format}-to-${target.runtime}`,
    );

    let compatibilityScore = 100;
    if (legacy.runtime !== target.runtime) compatibilityScore -= 20;
    compatibilityScore -= unsupportedFormats.length * 12;
    compatibilityScore -= Math.min(20, legacy.dependencies.length * 2);
    compatibilityScore = Math.max(0, compatibilityScore);

    if (unsupportedFormats.length > 0) {
      findings.push({
        code: "LEGACY_FORMAT_ADAPTER_REQUIRED",
        severity: UltraESeverity.WARNING,
        message: "One or more legacy data formats require adapters.",
        subject: legacy.key,
        metadata: { unsupportedFormats },
      });
    }

    if (compatibilityScore < 50) {
      findings.push({
        code: "LEGACY_MIGRATION_HIGH_RISK",
        severity:
          legacy.criticality >= 8
            ? UltraESeverity.CRITICAL
            : UltraESeverity.ERROR,
        message: "Legacy migration compatibility is below the safe threshold.",
        subject: legacy.key,
        metadata: { compatibilityScore },
      });
    }

    return {
      legacySystemKey: legacy.key,
      targetPlatformKey: target.key,
      compatibilityScore,
      adapters,
      migrationSteps: [
        "capture-immutable-snapshot",
        "validate-data-contracts",
        ...adapters.map((adapter) => `install-${adapter}`),
        "execute-shadow-migration",
        "verify-behavioral-equivalence",
        "switch-traffic-progressively",
      ],
      rollbackSteps: [
        "pause-target-writes",
        "restore-routing-to-legacy",
        "replay-confirmed-transactions",
        "verify-legacy-health",
      ],
      findings,
      generatedAt: new Date().toISOString(),
    };
  }
}
