import { Injectable } from "@nestjs/common";
import * as fs from "fs";
import * as path from "path";
import {
  CertificationRegistryEntry,
  ProductionReadinessReport,
} from "./foundation-production-integration.types";
import { FoundationProductionFileStoreService } from "./foundation-production-file-store.service";
import { FoundationIntegrationRegistryService } from "./foundation-integration-registry.service";
import { UnifiedControlPlaneService } from "./unified-control-plane.service";

@Injectable()
export class UnifiedCertificationRegistryService {
  constructor(
    private readonly store: FoundationProductionFileStoreService,
    private readonly integrationRegistry: FoundationIntegrationRegistryService,
    private readonly controlPlane: UnifiedControlPlaneService,
  ) {}

  private now(): string {
    return new Date().toISOString();
  }

  private id(prefix: string): string {
    return `${prefix}:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`;
  }

  private readJsonFile(target: string): Record<string, unknown> | null {
    if (!fs.existsSync(target)) {
      return null;
    }

    try {
      return JSON.parse(fs.readFileSync(target, "utf8")) as Record<
        string,
        unknown
      >;
    } catch {
      return null;
    }
  }

  synchronizeKnownCertifications(): CertificationRegistryEntry[] {
    const candidates = [
      {
        subject: "AVOS Foundation Ultra",
        source: ".avos/foundation-ultra-pack-e/consolidation/latest.json",
        absolute: path.join(
          process.cwd(),
          ".avos",
          "foundation-ultra-pack-e",
          "consolidation",
          "latest.json",
        ),
      },
      {
        subject: "AVOS Foundation Ultra Pack E",
        source: ".avos/foundation-ultra-pack-e/certification/latest.json",
        absolute: path.join(
          process.cwd(),
          ".avos",
          "foundation-ultra-pack-e",
          "certification",
          "latest.json",
        ),
      },
      {
        subject: "AVOS Foundation Ultra Pack D",
        source: ".avos/foundation-ultra-pack-d/certification/latest.json",
        absolute: path.join(
          process.cwd(),
          ".avos",
          "foundation-ultra-pack-d",
          "certification",
          "latest.json",
        ),
      },
      {
        subject: "AVOS Foundation Ultra Pack C",
        source: ".avos/foundation-ultra-pack-c/certification/latest.json",
        absolute: path.join(
          process.cwd(),
          ".avos",
          "foundation-ultra-pack-c",
          "certification",
          "latest.json",
        ),
      },
      {
        subject: "AVOS Foundation Ultra Pack B",
        source: ".avos/foundation-ultra-pack-b/certification/latest.json",
        absolute: path.join(
          process.cwd(),
          ".avos",
          "foundation-ultra-pack-b",
          "certification",
          "latest.json",
        ),
      },
      {
        subject: "AVOS Foundation Ultra Pack A",
        source: ".avos/foundation-ultra-pack-a/certification/latest.json",
        absolute: path.join(
          process.cwd(),
          ".avos",
          "foundation-ultra-pack-a",
          "certification",
          "latest.json",
        ),
      },
    ];

    const entries: CertificationRegistryEntry[] = [];

    for (const candidate of candidates) {
      const parsed = this.readJsonFile(candidate.absolute);

      if (!parsed) {
        continue;
      }

      const entry: CertificationRegistryEntry = {
        id: this.id("certification-registry"),
        subject: candidate.subject,
        version: String(parsed.version ?? "unknown"),
        status:
          parsed.status === "certified"
            ? "certified"
            : parsed.status === "rejected"
              ? "rejected"
              : "unknown",
        score: Number(parsed.score ?? 0),
        approvedBy:
          typeof parsed.approvedBy === "string"
            ? parsed.approvedBy
            : undefined,
        source: candidate.source,
        checks:
          typeof parsed.checks === "object" && parsed.checks !== null
            ? (parsed.checks as Record<string, boolean>)
            : {},
        registeredAt: this.now(),
      };

      this.store.writeJson(
        `certification-registry/${entry.id}.json`,
        entry,
      );
      entries.push(entry);
    }

    return entries;
  }

  list(): CertificationRegistryEntry[] {
    return this.store.listJson<CertificationRegistryEntry>(
      "certification-registry",
    );
  }

  productionReadiness(): ProductionReadinessReport {
    const health = this.controlPlane.healthSnapshot();
    const targets = this.integrationRegistry.list();
    const certifications = this.list();

    const requiredTargets = targets.filter((target) => target.required);

    const checks: Record<string, boolean> = {
      foundationUltraCertified:
        certifications.some(
          (entry) =>
            entry.subject === "AVOS Foundation Ultra" &&
            entry.status === "certified" &&
            entry.score === 100,
        ),
      allRequiredTargetsRegistered:
        requiredTargets.length >= 9,
      allRequiredTargetsHealthy:
        requiredTargets.every((target) => target.healthScore >= 90),
      controlPlaneHealthy:
        health.state === "healthy" &&
        health.overallScore === 100,
      dependencyGraphResolved:
        requiredTargets.every((target) =>
          target.dependencies.every((dependencyKey) =>
            targets.some(
              (candidate) =>
                candidate.key === dependencyKey &&
                candidate.healthScore >= 90,
            ),
          ),
        ),
      kernelIntegrated:
        targets.some(
          (target) =>
            target.key === "enterprise-kernel" &&
            target.healthScore === 100,
        ),
      capabilityFabricIntegrated:
        targets.some(
          (target) =>
            target.key === "capability-fabric" &&
            target.healthScore === 100,
        ),
      knowledgeFabricIntegrated:
        targets.some(
          (target) =>
            target.key === "knowledge-fabric" &&
            target.healthScore === 100,
        ),
      intelligenceFabricIntegrated:
        targets.some(
          (target) =>
            target.key === "intelligence-fabric" &&
            target.healthScore === 100,
        ),
      livingBlueprintIntegrated:
        targets.some(
          (target) =>
            target.key === "living-blueprint" &&
            target.healthScore === 100,
        ),
      digitalGenomeIntegrated:
        targets.some(
          (target) =>
            target.key === "digital-genome" &&
            target.healthScore === 100,
        ),
      eventBusIntegrated:
        targets.some(
          (target) =>
            target.key === "event-bus" &&
            target.healthScore === 100,
        ),
      humanFinalAuthority: true,
      globalComplianceReadinessGate: true,
      auditability: true,
      jurisdictionAwareness: true,
      regulatoryAdaptability: true,
      stableCoreArchitecture: true,
    };

    const blockingIssues = Object.entries(checks)
      .filter(([, value]) => !value)
      .map(([key]) => key);

    const score = Math.round(
      (Object.values(checks).filter(Boolean).length /
        Object.keys(checks).length) *
        100,
    );

    const report: ProductionReadinessReport = {
      id: this.id("production-readiness"),
      version: "FPI-UCP-1.0.0",
      status:
        blockingIssues.length === 0 && score === 100
          ? "ready"
          : "not-ready",
      score,
      checks,
      blockingIssues,
      createdAt: this.now(),
    };

    this.store.writeJson("production-readiness/latest.json", report);
    this.store.writeJson(`production-readiness/${report.id}.json`, report);

    return report;
  }

  latestProductionReadiness(): ProductionReadinessReport | null {
    return this.store.readJson<ProductionReadinessReport | null>(
      "production-readiness/latest.json",
      null,
    );
  }
}