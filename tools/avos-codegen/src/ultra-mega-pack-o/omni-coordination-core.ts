import { UltraOFinding, UltraOSeverity } from "./contracts";

export interface OmniRuntime {
  key: string;
  layer: "reality" | "treaty" | "planning" | "knowledge" | "governance" | "operations";
  readiness: number;
  authority: number;
}

export interface OmniCoordinationResult {
  active: boolean;
  readinessScore: number;
  authorityScore: number;
  activeRuntimes: string[];
  missingLayers: string[];
  findings: UltraOFinding[];
}

export class AvosOmniCoordinationCore {
  coordinate(runtimes: readonly OmniRuntime[]): OmniCoordinationResult {
    const required: OmniRuntime["layer"][] = [
      "reality",
      "treaty",
      "planning",
      "knowledge",
      "governance",
      "operations",
    ];

    const present = new Set(runtimes.map((runtime) => runtime.layer));
    const missingLayers = required.filter((layer) => !present.has(layer));

    const readinessScore =
      runtimes.length === 0
        ? 0
        : Math.round(runtimes.reduce((sum, runtime) => sum + runtime.readiness, 0) / runtimes.length);

    const authorityScore =
      runtimes.length === 0
        ? 0
        : Math.round(runtimes.reduce((sum, runtime) => sum + runtime.authority, 0) / runtimes.length);

    const findings: UltraOFinding[] = [];
    if (missingLayers.length > 0) {
      findings.push({
        code: "OMNI_COORDINATION_LAYER_MISSING",
        severity: UltraOSeverity.ERROR,
        message: "One or more omni coordination layers are missing.",
        metadata: { missingLayers },
      });
    }

    return {
      active: missingLayers.length === 0 && readinessScore >= 82 && authorityScore >= 82,
      readinessScore,
      authorityScore,
      activeRuntimes: runtimes.map((runtime) => runtime.key),
      missingLayers,
      findings,
    };
  }
}
