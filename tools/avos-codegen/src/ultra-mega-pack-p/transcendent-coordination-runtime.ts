import { UltraPFinding, UltraPSeverity } from "./contracts";

export interface TranscendentRuntime {
  key: string;
  layer:
    | "intelligence"
    | "exchange"
    | "forecasting"
    | "knowledge"
    | "governance"
    | "operations";
  readiness: number;
  autonomy: number;
}

export interface TranscendentCoordinationResult {
  active: boolean;
  readinessScore: number;
  autonomyScore: number;
  missingLayers: string[];
  activeRuntimes: string[];
  findings: UltraPFinding[];
}

export class AvosTranscendentCoordinationRuntime {
  coordinate(
    runtimes: readonly TranscendentRuntime[],
  ): TranscendentCoordinationResult {
    const required: TranscendentRuntime["layer"][] = [
      "intelligence",
      "exchange",
      "forecasting",
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

    const findings: UltraPFinding[] = [];

    if (missingLayers.length > 0) {
      findings.push({
        code: "TRANSCENDENT_COORDINATION_LAYER_MISSING",
        severity: UltraPSeverity.ERROR,
        message: "One or more transcendent coordination layers are missing.",
        metadata: { missingLayers },
      });
    }

    return {
      active:
        missingLayers.length === 0 &&
        readinessScore >= 84 &&
        autonomyScore >= 80,
      readinessScore,
      autonomyScore,
      missingLayers,
      activeRuntimes: runtimes.map((runtime) => runtime.key),
      findings,
    };
  }
}
