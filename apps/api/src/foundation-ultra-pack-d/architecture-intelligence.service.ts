import { Injectable } from "@nestjs/common";
import {
  ArchitectureAsset,
  ArchitectureFinding,
  ImpactAnalysis,
} from "./foundation-ultra-pack-d.types";
import { FoundationUltraPackDFileStoreService } from "./foundation-ultra-pack-d-file-store.service";

@Injectable()
export class ArchitectureIntelligenceService {
  constructor(
    private readonly store: FoundationUltraPackDFileStoreService,
  ) {
    this.seed();
  }

  private now(): string {
    return new Date().toISOString();
  }

  private id(prefix: string): string {
    return `${prefix}:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`;
  }

  private seed(): void {
    if (this.listAssets().length > 0) {
      return;
    }

    const seeds: Array<Omit<ArchitectureAsset, "id" | "createdAt" | "updatedAt">> = [
      {
        assetType: "foundation",
        canonicalName: "AVOS Foundation Ultra Mega Pack A",
        version: "FUPA-1.0.0",
        owner: "AVOS Foundation",
        dependencies: [],
        contracts: ["avos.foundation.status"],
        policies: ["FOUNDATION_FIRST", "HUMAN_FINAL_AUTHORITY"],
        criticality: "critical",
        expectedState: { status: "certified", score: 100 },
        runtimeState: { status: "certified", score: 100 },
        status: "active",
      },
      {
        assetType: "foundation",
        canonicalName: "AVOS Foundation Ultra Mega Pack B",
        version: "FUPB-1.0.0",
        owner: "AVOS Foundation",
        dependencies: [],
        contracts: ["avos.foundation.status", "avos.contract.registry"],
        policies: ["FOUNDATION_FIRST", "GLOBAL_COMPLIANCE_READINESS_GATE"],
        criticality: "critical",
        expectedState: { status: "certified", score: 100 },
        runtimeState: { status: "certified", score: 100 },
        status: "active",
      },
      {
        assetType: "foundation",
        canonicalName: "AVOS Foundation Ultra Mega Pack C",
        version: "FUPC-1.0.0",
        owner: "AVOS Foundation",
        dependencies: [],
        contracts: ["avos.foundation.status", "avos.policy.runtime"],
        policies: ["ZERO_TRUST_REQUIRED", "PRIVACY_BY_DESIGN"],
        criticality: "critical",
        expectedState: { status: "certified", score: 100 },
        runtimeState: { status: "certified", score: 100 },
        status: "active",
      },
      {
        assetType: "foundation",
        canonicalName: "AVOS Foundation Ultra Mega Pack D",
        version: "FUPD-1.0.0",
        owner: "AVOS Architecture",
        dependencies: [],
        contracts: ["avos.architecture.intelligence", "avos.runtime.observability"],
        policies: ["FOUNDATION_FIRST", "HUMAN_FINAL_AUTHORITY"],
        criticality: "critical",
        expectedState: { status: "operational", healthScore: 100 },
        runtimeState: { status: "operational", healthScore: 100 },
        status: "active",
      },
    ];

    const created: ArchitectureAsset[] = [];
    for (const seed of seeds) {
      created.push(this.registerAsset(seed));
    }

    const d = created.find((asset) =>
      asset.canonicalName.endsWith("Pack D"),
    );
    const a = created.find((asset) =>
      asset.canonicalName.endsWith("Pack A"),
    );
    const b = created.find((asset) =>
      asset.canonicalName.endsWith("Pack B"),
    );
    const c = created.find((asset) =>
      asset.canonicalName.endsWith("Pack C"),
    );

    if (d && a && b && c) {
      this.updateDependencies(d.id, [a.id, b.id, c.id]);
    }
  }

  registerAsset(
    input: Omit<ArchitectureAsset, "id" | "createdAt" | "updatedAt">,
  ): ArchitectureAsset {
    const existing = this.listAssets().find(
      (asset) =>
        asset.canonicalName === input.canonicalName &&
        asset.version === input.version,
    );

    if (existing) {
      return existing;
    }

    const timestamp = this.now();
    const record: ArchitectureAsset = {
      ...input,
      id: this.id("architecture-asset"),
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    this.store.writeJson(`architecture-assets/${record.id}.json`, record);
    return record;
  }

  listAssets(): ArchitectureAsset[] {
    return this.store.listJson<ArchitectureAsset>("architecture-assets");
  }

  updateDependencies(
    assetId: string,
    dependencies: string[],
  ): ArchitectureAsset {
    const asset = this.listAssets().find((item) => item.id === assetId);

    if (!asset) {
      throw new Error(`Architecture asset not found: ${assetId}`);
    }

    const updated: ArchitectureAsset = {
      ...asset,
      dependencies: Array.from(new Set(dependencies)),
      updatedAt: this.now(),
    };

    this.store.writeJson(`architecture-assets/${updated.id}.json`, updated);
    return updated;
  }

  updateRuntimeState(
    assetId: string,
    runtimeState: Record<string, unknown>,
  ): ArchitectureAsset {
    const asset = this.listAssets().find((item) => item.id === assetId);

    if (!asset) {
      throw new Error(`Architecture asset not found: ${assetId}`);
    }

    const updated: ArchitectureAsset = {
      ...asset,
      runtimeState,
      updatedAt: this.now(),
    };

    this.store.writeJson(`architecture-assets/${updated.id}.json`, updated);
    return updated;
  }

  detectDrift(assetId: string): ArchitectureFinding {
    const asset = this.listAssets().find((item) => item.id === assetId);

    if (!asset) {
      throw new Error(`Architecture asset not found: ${assetId}`);
    }

    const differences: Record<string, { expected: unknown; actual: unknown }> = {};
    const keys = new Set([
      ...Object.keys(asset.expectedState),
      ...Object.keys(asset.runtimeState),
    ]);

    for (const key of keys) {
      const expected = asset.expectedState[key];
      const actual = asset.runtimeState[key];

      if (JSON.stringify(expected) !== JSON.stringify(actual)) {
        differences[key] = { expected, actual };
      }
    }

    const driftDetected = Object.keys(differences).length > 0;
    const severity =
      !driftDetected
        ? "info"
        : asset.criticality === "critical"
          ? "critical"
          : asset.criticality === "high"
            ? "high"
            : "medium";

    const finding: ArchitectureFinding = {
      id: this.id("architecture-finding"),
      assetId,
      category: "drift",
      severity,
      title: driftDetected
        ? "Architecture runtime drift detected"
        : "Architecture state aligned",
      description: driftDetected
        ? "Runtime state differs from the expected architecture state."
        : "Runtime state matches the expected architecture state.",
      evidence: { differences },
      recommendation: driftDetected
        ? "Review the runtime change, update the Living Blueprint or restore expected state."
        : "No corrective action required.",
      blocking: driftDetected && asset.criticality === "critical",
      status: driftDetected ? "open" : "resolved",
      createdAt: this.now(),
      updatedAt: this.now(),
    };

    this.store.writeJson(`architecture-findings/${finding.id}.json`, finding);
    return finding;
  }

  listFindings(): ArchitectureFinding[] {
    return this.store.listJson<ArchitectureFinding>("architecture-findings");
  }

  analyzeImpact(
    changeId: string,
    targetAssetId: string,
  ): ImpactAnalysis {
    const assets = this.listAssets();
    const target = assets.find((asset) => asset.id === targetAssetId);

    if (!target) {
      throw new Error(`Architecture asset not found: ${targetAssetId}`);
    }

    const direct = assets
      .filter((asset) => asset.dependencies.includes(targetAssetId))
      .map((asset) => asset.id);

    const transitive = this.resolveTransitiveDependents(
      targetAssetId,
      assets,
    ).filter((id) => !direct.includes(id));

    const affectedAssets = Array.from(
      new Set([targetAssetId, ...direct, ...transitive]),
    );

    const affected = assets.filter((asset) =>
      affectedAssets.includes(asset.id),
    );

    const affectedContracts = Array.from(
      new Set(affected.flatMap((asset) => asset.contracts)),
    );
    const affectedPolicies = Array.from(
      new Set(affected.flatMap((asset) => asset.policies)),
    );

    const criticalityWeight: Record<ArchitectureAsset["criticality"], number> = {
      low: 10,
      medium: 25,
      high: 50,
      critical: 75,
    };

    const riskScore = Math.min(
      100,
      Math.round(
        criticalityWeight[target.criticality] +
          direct.length * 8 +
          transitive.length * 4 +
          affectedContracts.length * 2,
      ),
    );

    const riskLevel: ImpactAnalysis["riskLevel"] =
      riskScore >= 80
        ? "critical"
        : riskScore >= 60
          ? "high"
          : riskScore >= 30
            ? "medium"
            : "low";

    const analysis: ImpactAnalysis = {
      id: this.id("impact-analysis"),
      changeId,
      targetAssetId,
      affectedAssets,
      directDependencies: direct,
      transitiveDependencies: transitive,
      affectedContracts,
      affectedPolicies,
      riskScore,
      riskLevel,
      requiresHumanApproval:
        riskLevel === "high" || riskLevel === "critical",
      recommendations: [
        "Validate contract compatibility before execution.",
        "Capture a rollback checkpoint.",
        "Run verification and smoke tests after execution.",
        ...(riskScore >= 60
          ? ["Require Human Final Authority approval."]
          : []),
      ],
      analyzedAt: this.now(),
    };

    this.store.writeJson(`impact-analyses/${analysis.id}.json`, analysis);
    return analysis;
  }

  listImpactAnalyses(): ImpactAnalysis[] {
    return this.store.listJson<ImpactAnalysis>("impact-analyses");
  }

  private resolveTransitiveDependents(
    targetAssetId: string,
    assets: ArchitectureAsset[],
  ): string[] {
    const visited = new Set<string>();
    const queue = [targetAssetId];

    while (queue.length > 0) {
      const current = queue.shift() as string;
      const dependents = assets
        .filter((asset) => asset.dependencies.includes(current))
        .map((asset) => asset.id);

      for (const dependent of dependents) {
        if (!visited.has(dependent)) {
          visited.add(dependent);
          queue.push(dependent);
        }
      }
    }

    return Array.from(visited);
  }
}