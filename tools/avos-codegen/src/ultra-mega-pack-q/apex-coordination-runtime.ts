import { UltraQFinding, UltraQSeverity } from "./contracts";

export interface ApexRuntime {
  key: string;
  layer:
    | "consciousness"
    | "arbitration"
    | "simulation"
    | "knowledge"
    | "governance"
    | "operations";
  readiness: number;
  autonomy: number;
}

export interface ApexCoordinationResult {
  active: boolean;
  readinessScore: number;
  autonomyScore: number;
  activeRuntimes: string[];
  missingLayers: string[];
  findings: UltraQFinding[];
}

export class AvosApexCoordinationRuntime {
  coordinate(
    runtimes: readonly ApexRuntime[],
  ): ApexCoordinationResult {
    const required: ApexRuntime["layer"][] = [
      "consciousness",
      "arbitration",
      "simulation",
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

    const findings: UltraQFinding[] = [];

    if (missingLayers.length > 0) {
      findings.push({
        code: "APEX_COORDINATION_LAYER_MISSING",
        severity: UltraQSeverity.ERROR,
        message: "One or more apex coordination layers are missing.",
        metadata: { missingLayers },
      });
    }

    return {
      active:
        missingLayers.length === 0 &&
        readinessScore >= 86 &&
        autonomyScore >= 82,
      readinessScore,
      autonomyScore,
      activeRuntimes: runtimes.map((runtime) => runtime.key),
      missingLayers,
      findings,
    };
  }
}
