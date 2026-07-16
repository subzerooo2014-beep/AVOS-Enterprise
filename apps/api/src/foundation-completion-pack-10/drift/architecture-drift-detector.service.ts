import { Injectable } from "@nestjs/common";
import {
  ArchitectureDriftFinding,
  LivingBlueprintAsset
} from "../foundation-pack-10.types";
import { LivingBlueprintRegistryService } from "../blueprints/living-blueprint-registry.service";
import { RuntimeArchitectureSnapshotService } from "../runtime/runtime-architecture-snapshot.service";
import { ArchitectureAuditService } from "../observability/architecture-audit.service";

@Injectable()
export class ArchitectureDriftDetectorService {
  private readonly findings:
    ArchitectureDriftFinding[] = [];

  constructor(
    private readonly blueprints: LivingBlueprintRegistryService,
    private readonly runtime: RuntimeArchitectureSnapshotService,
    private readonly audit: ArchitectureAuditService
  ) {}

  detect(input: {
    blueprintId: string;
    runtimeSnapshotId: string;
    actorIdentityId: string;
    correlationId: string;
  }) {
    const blueprint = this.blueprints.get(
      input.blueprintId
    );

    const snapshot = this.runtime.get(
      input.runtimeSnapshotId
    );

    this.findings.length = 0;

    const expected = new Map(
      blueprint.assets.map((asset) => [asset.id, asset])
    );

    const actual = new Map(
      snapshot.assets.map((asset) => [asset.id, asset])
    );

    for (const [id, asset] of expected.entries()) {
      const runtimeAsset = actual.get(id);

      if (!runtimeAsset) {
        this.add(
          blueprint.id,
          snapshot.id,
          id,
          "critical",
          "missing-at-runtime",
          `Expected asset ${id} is missing at runtime.`,
          asset,
          undefined
        );
        continue;
      }

      this.compareAsset(
        blueprint.id,
        snapshot.id,
        asset,
        runtimeAsset
      );
    }

    for (const [id, asset] of actual.entries()) {
      if (!expected.has(id)) {
        this.add(
          blueprint.id,
          snapshot.id,
          id,
          "high",
          "unexpected-at-runtime",
          `Unexpected runtime asset detected: ${id}.`,
          undefined,
          asset
        );
      }
    }

    this.audit.record({
      correlationId: input.correlationId,
      category: "drift",
      action: "architecture-drift-detected",
      subjectId: blueprint.id,
      actorIdentityId: input.actorIdentityId,
      outcome:
        this.findings.some(
          (finding) =>
            finding.severity === "critical" ||
            finding.severity === "high"
        )
          ? "warning"
          : "success",
      metadata: {
        runtimeSnapshotId: snapshot.id,
        findings: this.findings.length
      }
    });

    return {
      blueprintId: blueprint.id,
      runtimeSnapshotId: snapshot.id,
      drifted: this.findings.length > 0,
      findings: [...this.findings],
      checkedAt: new Date().toISOString()
    };
  }

  list() {
    return [...this.findings];
  }

  summary() {
    return {
      total: this.findings.length,
      critical: this.findings.filter(
        (finding) => finding.severity === "critical"
      ).length,
      high: this.findings.filter(
        (finding) => finding.severity === "high"
      ).length,
      medium: this.findings.filter(
        (finding) => finding.severity === "medium"
      ).length,
      low: this.findings.filter(
        (finding) => finding.severity === "low"
      ).length
    };
  }

  private compareAsset(
    blueprintId: string,
    snapshotId: string,
    expected: LivingBlueprintAsset,
    actual: LivingBlueprintAsset
  ) {
    if (expected.version !== actual.version) {
      this.add(
        blueprintId,
        snapshotId,
        expected.id,
        "high",
        "version-mismatch",
        `Version mismatch for ${expected.id}.`,
        expected.version,
        actual.version
      );
    }

    if (
      JSON.stringify(expected.dependencies.sort()) !==
      JSON.stringify(actual.dependencies.sort())
    ) {
      this.add(
        blueprintId,
        snapshotId,
        expected.id,
        "high",
        "dependency-mismatch",
        `Dependency mismatch for ${expected.id}.`,
        expected.dependencies,
        actual.dependencies
      );
    }

    if (
      JSON.stringify(expected.contracts.sort()) !==
      JSON.stringify(actual.contracts.sort())
    ) {
      this.add(
        blueprintId,
        snapshotId,
        expected.id,
        "critical",
        "contract-mismatch",
        `Contract mismatch for ${expected.id}.`,
        expected.contracts,
        actual.contracts
      );
    }
  }

  private add(
    blueprintId: string,
    runtimeSnapshotId: string,
    assetId: string,
    severity: ArchitectureDriftFinding["severity"],
    driftType: ArchitectureDriftFinding["driftType"],
    message: string,
    expected?: unknown,
    actual?: unknown
  ) {
    this.findings.push({
      id: `architecture-drift:${Date.now()}:${
        this.findings.length + 1
      }`,
      blueprintId,
      runtimeSnapshotId,
      assetId,
      severity,
      driftType,
      message,
      expected,
      actual,
      createdAt: new Date().toISOString()
    });
  }
}
