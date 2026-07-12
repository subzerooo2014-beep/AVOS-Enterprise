import { UltraRFinding, UltraRSeverity } from "./contracts";

export interface ZenithRuntime {
  key: string;
  layer:
    | "intent"
    | "constitution"
    | "optimization"
    | "knowledge"
    | "governance"
    | "operations";
  readiness: number;
  autonomy: number;
}

export interface ZenithCoordinationResult {
  active: boolean;
  readinessScore: number;
  autonomyScore: number;
  activeRuntimes: string[];
  missingLayers: string[];
  findings: UltraRFinding[];
}

export class AvosZenithCoordinationRuntime {
  coordinate(runtimes: readonly ZenithRuntime[]): ZenithCoordinationResult {
    const required: ZenithRuntime["layer"][] = [
      "intent",
      "constitution",
      "optimization",
      "knowledge",
      "governance",
      "operations",
    ];

    const present = new Set(runtimes.map((runtime) => runtime.layer));
    const missingLayers = required.filter((layer) => !present.has(layer));

    const readinessScore =
      runtimes.length === 0
        ? 0
        : Math.round(
            runtimes.reduce((sum, runtime) => sum + runtime.readiness, 0) /
              runtimes.length,
          );

    const autonomyScore =
      runtimes.length === 0
        ? 0
        : Math.round(
            runtimes.reduce((sum, runtime) => sum + runtime.autonomy, 0) /
              runtimes.length,
          );

    const findings: UltraRFinding[] = [];

    if (missingLayers.length > 0) {
      findings.push({
        code: "ZENITH_COORDINATION_LAYER_MISSING",
        severity: UltraRSeverity.ERROR,
        message: "One or more zenith coordination layers are missing.",
        metadata: { missingLayers },
      });
    }

    return {
      active:
        missingLayers.length === 0 &&
        readinessScore >= 88 &&
        autonomyScore >= 84,
      readinessScore,
      autonomyScore,
      activeRuntimes: runtimes.map((runtime) => runtime.key),
      missingLayers,
      findings,
    };
  }
}
