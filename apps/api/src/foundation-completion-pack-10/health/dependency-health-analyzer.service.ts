import { Injectable } from "@nestjs/common";
import {
  DependencyHealthFinding
} from "../foundation-pack-10.types";
import { LivingBlueprintRegistryService } from "../blueprints/living-blueprint-registry.service";
import { ArchitectureAuditService } from "../observability/architecture-audit.service";

@Injectable()
export class DependencyHealthAnalyzerService {
  private readonly findings:
    DependencyHealthFinding[] = [];

  constructor(
    private readonly blueprints: LivingBlueprintRegistryService,
    private readonly audit: ArchitectureAuditService
  ) {}

  analyze(input: {
    blueprintId: string;
    actorIdentityId: string;
    correlationId: string;
  }) {
    const blueprint = this.blueprints.get(
      input.blueprintId
    );

    this.findings.length = 0;

    const assets = new Map(
      blueprint.assets.map((asset) => [asset.id, asset])
    );

    const incomingCount = new Map<string, number>();

    for (const asset of blueprint.assets) {
      for (const dependencyId of asset.dependencies) {
        incomingCount.set(
          dependencyId,
          (incomingCount.get(dependencyId) ?? 0) + 1
        );

        const dependency = assets.get(dependencyId);

        if (!dependency) {
          this.add(
            blueprint.id,
            asset.id,
            "critical",
            "missing-dependency",
            `Asset ${asset.id} depends on missing asset ${dependencyId}.`,
            [dependencyId]
          );
          continue;
        }

        if (!dependency.active) {
          this.add(
            blueprint.id,
            asset.id,
            "error",
            "inactive-dependency",
            `Asset ${asset.id} depends on inactive asset ${dependencyId}.`,
            [dependencyId]
          );
        }
      }

      if (asset.dependencies.length > 10) {
        this.add(
          blueprint.id,
          asset.id,
          "warning",
          "high-fan-out",
          `Asset ${asset.id} has high dependency fan-out.`,
          asset.dependencies
        );
      }
    }

    for (const asset of blueprint.assets) {
      const incoming = incomingCount.get(asset.id) ?? 0;

      if (
        incoming === 0 &&
        asset.dependencies.length === 0
      ) {
        this.add(
          blueprint.id,
          asset.id,
          "info",
          "orphan-asset",
          `Asset ${asset.id} is isolated in the architecture graph.`,
          []
        );
      }

      if (incoming > 15) {
        this.add(
          blueprint.id,
          asset.id,
          "warning",
          "high-fan-in",
          `Asset ${asset.id} has high dependency fan-in.`,
          []
        );
      }
    }

    for (const cycle of this.detectCycles(blueprint.assets)) {
      this.add(
        blueprint.id,
        cycle[0] ?? "unknown",
        "critical",
        "circular-dependency",
        `Circular dependency detected: ${cycle.join(" -> ")}`,
        cycle
      );
    }

    this.audit.record({
      correlationId: input.correlationId,
      category: "dependency-health",
      action: "dependency-health-analyzed",
      subjectId: blueprint.id,
      actorIdentityId: input.actorIdentityId,
      outcome:
        this.findings.some(
          (finding) =>
            finding.severity === "critical" ||
            finding.severity === "error"
        )
          ? "failure"
          : this.findings.length > 0
            ? "warning"
            : "success",
      metadata: {
        findings: this.findings.length
      }
    });

    return {
      blueprintId: blueprint.id,
      healthy: !this.findings.some(
        (finding) =>
          finding.severity === "critical" ||
          finding.severity === "error"
      ),
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
      errors: this.findings.filter(
        (finding) => finding.severity === "error"
      ).length,
      warnings: this.findings.filter(
        (finding) => finding.severity === "warning"
      ).length
    };
  }

  private detectCycles(
    assets: Array<{
      id: string;
      dependencies: string[];
    }>
  ) {
    const graph = new Map(
      assets.map((asset) => [
        asset.id,
        asset.dependencies
      ])
    );

    const visiting = new Set<string>();
    const visited = new Set<string>();
    const cycles: string[][] = [];

    const visit = (id: string, path: string[]) => {
      if (visiting.has(id)) {
        const index = path.indexOf(id);
        cycles.push([...path.slice(index), id]);
        return;
      }

      if (visited.has(id)) {
        return;
      }

      visiting.add(id);
      path.push(id);

      for (const next of graph.get(id) ?? []) {
        if (graph.has(next)) {
          visit(next, [...path]);
        }
      }

      visiting.delete(id);
      visited.add(id);
    };

    for (const asset of assets) {
      visit(asset.id, []);
    }

    return cycles;
  }

  private add(
    blueprintId: string,
    assetId: string,
    severity: DependencyHealthFinding["severity"],
    code: DependencyHealthFinding["code"],
    message: string,
    relatedAssetIds: string[]
  ) {
    this.findings.push({
      id: `dependency-health:${Date.now()}:${
        this.findings.length + 1
      }`,
      blueprintId,
      assetId,
      severity,
      code,
      message,
      relatedAssetIds,
      createdAt: new Date().toISOString()
    });
  }
}
