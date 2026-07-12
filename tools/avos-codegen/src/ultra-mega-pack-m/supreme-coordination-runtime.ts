import { UltraMFinding, UltraMSeverity } from "./contracts";

export interface SupremeRuntime {
  key: string;
  layer:
    | "constitution"
    | "trust"
    | "treasury"
    | "archive"
    | "governance"
    | "operations";
  readiness: number;
  autonomy: number;
  dependencies: string[];
}

export interface AvosSupremeCoordinationResult {
  coordinated: boolean;
  readinessScore: number;
  autonomyScore: number;
  activeRuntimes: string[];
  missingLayers: string[];
  findings: UltraMFinding[];
  coordinatedAt: string;
}

export class AvosSupremeCoordinationRuntime {
  coordinate(
    runtimes: readonly SupremeRuntime[],
  ): AvosSupremeCoordinationResult {
    const requiredLayers: SupremeRuntime["layer"][] = [
      "constitution",
      "trust",
      "treasury",
      "archive",
      "governance",
      "operations",
    ];

    const presentLayers = new Set(runtimes.map((runtime) => runtime.layer));
    const missingLayers = requiredLayers.filter(
      (layer) => !presentLayers.has(layer),
    );

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

    const findings: UltraMFinding[] = [];

    if (missingLayers.length > 0) {
      findings.push({
        code: "SUPREME_COORDINATION_LAYER_MISSING",
        severity: UltraMSeverity.ERROR,
        message: "One or more supreme coordination layers are missing.",
        metadata: { missingLayers },
      });
    }

    if (readinessScore < 80 || autonomyScore < 75) {
      findings.push({
        code: "SUPREME_COORDINATION_NOT_READY",
        severity: UltraMSeverity.WARNING,
        message: "Supreme coordination readiness is below threshold.",
        metadata: { readinessScore, autonomyScore },
      });
    }

    return {
      coordinated:
        missingLayers.length === 0 &&
        readinessScore >= 80 &&
        autonomyScore >= 75,
      readinessScore,
      autonomyScore,
      activeRuntimes: runtimes.map((runtime) => runtime.key),
      missingLayers,
      findings,
      coordinatedAt: new Date().toISOString(),
    };
  }
}
