import { UltraIFinding, UltraISeverity } from "./contracts";

export interface SingularityEngine {
  key: string;
  layer:
    | "codegen"
    | "genesis"
    | "brain"
    | "evolution"
    | "operations"
    | "control";
  readiness: number;
  capabilities: string[];
}

export interface SingularityCoordinationResult {
  coordinated: boolean;
  readinessScore: number;
  activeEngines: string[];
  missingLayers: string[];
  findings: UltraIFinding[];
  coordinatedAt: string;
}

export class EnterpriseSingularityCoordinator {
  coordinate(
    engines: readonly SingularityEngine[],
  ): SingularityCoordinationResult {
    const requiredLayers: SingularityEngine["layer"][] = [
      "codegen",
      "genesis",
      "brain",
      "evolution",
      "operations",
      "control",
    ];

    const presentLayers = new Set(engines.map((engine) => engine.layer));
    const missingLayers = requiredLayers.filter(
      (layer) => !presentLayers.has(layer),
    );

    const readinessScore =
      engines.length === 0
        ? 0
        : Math.round(
            engines.reduce((sum, engine) => sum + engine.readiness, 0) /
              engines.length,
          );

    const findings: UltraIFinding[] = [];

    if (missingLayers.length > 0) {
      findings.push({
        code: "SINGULARITY_LAYER_MISSING",
        severity: UltraISeverity.ERROR,
        message: "One or more singularity coordination layers are missing.",
        metadata: { missingLayers },
      });
    }

    if (readinessScore < 70) {
      findings.push({
        code: "SINGULARITY_READINESS_LOW",
        severity: UltraISeverity.WARNING,
        message: "Enterprise singularity readiness is below threshold.",
        metadata: { readinessScore },
      });
    }

    return {
      coordinated: missingLayers.length === 0 && readinessScore >= 70,
      readinessScore,
      activeEngines: engines.map((engine) => engine.key),
      missingLayers,
      findings,
      coordinatedAt: new Date().toISOString(),
    };
  }
}
