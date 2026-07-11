import {
  UltraBFinding,
  UltraBSeverity,
} from "../contracts";
import {
  SecurityAsset,
  SecurityAssessment,
  SecurityThreat,
} from "./contracts";

export class AutonomousSecurityIntelligenceEngine {
  assess(
    assets: readonly SecurityAsset[],
    threats: readonly SecurityThreat[],
  ): SecurityAssessment {
    const assetsByKey =
      new Map(
        assets.map((asset) => [asset.key, asset]),
      );

    const findings: UltraBFinding[] = [];
    const controls = new Set<string>();
    let riskTotal = 0;

    for (const threat of threats) {
      for (const target of threat.targetAssets) {
        const asset = assetsByKey.get(target);

        if (!asset) {
          findings.push({
            code: "SECURITY_ASSET_NOT_FOUND",
            severity: UltraBSeverity.ERROR,
            message:
              `Threat target asset was not found: ${target}`,
            subject: target,
            metadata: {},
          });
          continue;
        }

        const exposure =
          threat.probability *
          threat.impact *
          Math.max(1, asset.criticality) *
          Math.max(0.1, (100 - asset.trustLevel) / 100);

        riskTotal += exposure;

        if (exposure >= 1000) {
          findings.push({
            code: "HIGH_SECURITY_EXPOSURE",
            severity:
              exposure >= 2500
                ? UltraBSeverity.CRITICAL
                : UltraBSeverity.ERROR,
            message:
              `High security exposure detected for ${asset.key}.`,
            subject: asset.key,
            metadata: { exposure },
          });

          controls.add("zero-trust-enforcement");
          controls.add("continuous-threat-monitoring");
          controls.add("incident-response-runbook");
        }
      }
    }

    const riskScore =
      Math.max(
        0,
        Math.min(100, Math.round(riskTotal / 100)),
      );

    return {
      score: 100 - riskScore,
      riskScore,
      findings,
      requiredControls: Array.from(controls),
      assessedAt: new Date().toISOString(),
    };
  }
}
