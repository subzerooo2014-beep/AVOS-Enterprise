import { Injectable } from "@nestjs/common";
import { existsSync } from "fs";
import { join } from "path";
import {
  AvosFactoryIntegrationDescriptor,
  AvosFactoryIntegrationRegistry,
  AvosFactoryIntegrationTarget
} from "./avos-factory-integration.contracts";

@Injectable()
export class AvosFactoryIntegrationDiscoveryService {
  private readonly sourceRoot =
    join(process.cwd(), "src");

  discover(): AvosFactoryIntegrationRegistry {
    const integrations = [
      this.inspect(
        "enterprise-kernel",
        [
          "enterprise-kernel",
          "enterprise-kernel-mega-pack-6",
          "kernel"
        ],
        [
          "lifecycle",
          "dependency-resolution",
          "health",
          "diagnostics",
          "governance"
        ],
        true
      ),
      this.inspect(
        "capability-fabric",
        [
          "capability-fabric",
          "capability-fabric-cf-1",
          "capability-fabric-cf-2",
          "capability-fabric-cf-3",
          "capability-fabric-cf-4",
          "capability-fabric-cf-5"
        ],
        [
          "capability-registry",
          "capability-resolution",
          "orchestration",
          "governance",
          "certification"
        ],
        true
      ),
      this.inspect(
        "knowledge-fabric",
        [
          "knowledge-fabric",
          "knowledge-fabric-kf-1",
          "knowledge-fabric-kf-2",
          "knowledge-fabric-kf-3",
          "knowledge-fabric-kf-4",
          "knowledge-fabric-kf-5"
        ],
        [
          "knowledge-registration",
          "knowledge-search",
          "memory",
          "provenance",
          "certification"
        ],
        true
      ),
      this.inspect(
        "living-blueprint",
        [
          "living-blueprint",
          "enterprise-living-blueprint",
          "blueprint"
        ],
        [
          "architecture-registration",
          "runtime-synchronization",
          "dependency-mapping",
          "change-tracking"
        ],
        false
      ),
      this.inspect(
        "digital-dna",
        [
          "digital-dna",
          "enterprise-digital-dna",
          "metadata-platform"
        ],
        [
          "asset-identity",
          "purpose",
          "dependencies",
          "policies",
          "metrics",
          "evolution-history"
        ],
        false
      )
    ];

    return {
      system: "AVOS Factory Core V1",
      version: "1.0.0",
      foundationFirst: true,
      capabilityFirst: true,
      blueprintDriven: true,
      humanFinalAuthority: true,
      integrations,
      connectedCount:
        integrations.filter(
          (item) =>
            item.status === "connected"
        ).length,
      availableCount:
        integrations.filter(
          (item) =>
            item.status === "available"
        ).length,
      missingCount:
        integrations.filter(
          (item) =>
            item.status === "not-detected"
        ).length,
      generatedAt:
        new Date().toISOString()
    };
  }

  private inspect(
    target: AvosFactoryIntegrationTarget,
    candidates: string[],
    capabilities: string[],
    requiredForProduction: boolean
  ): AvosFactoryIntegrationDescriptor {
    const detectedPaths =
      candidates
        .map((candidate) =>
          join(
            this.sourceRoot,
            candidate
          )
        )
        .filter((candidate) =>
          existsSync(candidate)
        );

    return {
      target,
      status:
        detectedPaths.length > 0
          ? "available"
          : "not-detected",
      detectedPaths,
      capabilities,
      requiredForProduction,
      lastCheckedAt:
        new Date().toISOString()
    };
  }
}
