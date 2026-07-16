import { Injectable } from "@nestjs/common";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import {
  CAPABILITY_FABRIC_LAYER_DEFINITIONS,
} from "./capability-fabric-review.registry";
import {
  ArchitectureLayerReview,
  ArchitectureReviewFinding,
} from "./capability-fabric-review.types";

@Injectable()
export class CapabilityFabricScannerService {
  scan(repoRoot = process.cwd()): ArchitectureLayerReview[] {
    return CAPABILITY_FABRIC_LAYER_DEFINITIONS.map((definition) =>
      this.scanLayer(repoRoot, definition),
    );
  }

  private scanLayer(
    repoRoot: string,
    definition: (typeof CAPABILITY_FABRIC_LAYER_DEFINITIONS)[number],
  ): ArchitectureLayerReview {
    const root = join(repoRoot, definition.path);
    const present = existsSync(root);
    const findings: ArchitectureReviewFinding[] = [];

    if (!present) {
      findings.push(
        this.finding(
          "STRUCTURE",
          "CRITICAL",
          `${definition.layer} layer is missing`,
          `Expected layer path does not exist: ${definition.path}`,
          { path: definition.path },
          "Restore or rebuild the missing layer before continuing.",
          true,
        ),
      );

      return {
        layer: definition.layer,
        module: definition.module,
        present: false,
        exportedServices: 0,
        publicRoutes: 0,
        dependencies: [],
        score: 0,
        findings,
      };
    }

    const files = readdirSync(root).filter((file) => file.endsWith(".ts"));
    const source = files
      .map((file) => readFileSync(join(root, file), "utf8"))
      .join("\n");

    const moduleFile = files.find((file) => file.endsWith(".module.ts"));
    const moduleSource = moduleFile
      ? readFileSync(join(root, moduleFile), "utf8")
      : "";

    if (!moduleFile) {
      findings.push(
        this.finding(
          "STRUCTURE",
          "CRITICAL",
          `${definition.layer} module file is missing`,
          "No NestJS module file was found for this layer.",
          { files },
          "Add a canonical module file.",
          true,
        ),
      );
    }

    const exportedServices = definition.requiredExports.filter((service) =>
      moduleSource.includes(service),
    ).length;

    if (exportedServices < definition.requiredExports.length) {
      findings.push(
        this.finding(
          "CONTRACT",
          "HIGH",
          `${definition.layer} export surface is incomplete`,
          "One or more required services are not exported by the module.",
          {
            expected: definition.requiredExports,
            exported: definition.requiredExports.filter((service) =>
              moduleSource.includes(service),
            ),
          },
          "Standardize the module export contract.",
          false,
        ),
      );
    }

    const publicRoutes = (source.match(/@(Get|Post|Patch|Put|Delete)\(/g) ?? [])
      .length;
    const dependencies = [
      ...new Set(
        [...source.matchAll(/from "\.\.\/([^"]+)"/g)].map(
          (match) => match[1].split("/")[0],
        ),
      ),
    ];

    if (definition.layer === "CF-1" && dependencies.length > 0) {
      findings.push(
        this.finding(
          "DEPENDENCY",
          "HIGH",
          "CF-1 contains upward dependencies",
          "The foundation registry layer should not depend on higher Capability Fabric layers.",
          { dependencies },
          "Remove upward dependencies from CF-1.",
          true,
        ),
      );
    }

    if (!source.includes("Foundation First") && !source.includes("foundationFirst")) {
      findings.push(
        this.finding(
          "GOVERNANCE",
          "MEDIUM",
          `${definition.layer} lacks explicit Foundation First marker`,
          "No explicit Foundation First marker was detected.",
          {},
          "Add an explicit architectural principle marker.",
          false,
        ),
      );
    }

    if (!source.includes("rollback") && !source.includes("Rollback")) {
      findings.push(
        this.finding(
          "READINESS",
          "LOW",
          `${definition.layer} has no runtime rollback marker`,
          "Rollback is provided by the installation pack, but no layer-level marker was detected.",
          {},
          "Document rollback ownership and boundaries.",
          false,
        ),
      );
    }

    const baseScore = 100;
    const penalty = findings.reduce((total, finding) => {
      if (finding.severity === "CRITICAL") return total + 35;
      if (finding.severity === "HIGH") return total + 20;
      if (finding.severity === "MEDIUM") return total + 10;
      if (finding.severity === "LOW") return total + 5;
      return total;
    }, 0);

    return {
      layer: definition.layer,
      module: definition.module,
      present: true,
      exportedServices,
      publicRoutes,
      dependencies,
      score: Math.max(0, baseScore - penalty),
      findings,
    };
  }

  private finding(
    category: ArchitectureReviewFinding["category"],
    severity: ArchitectureReviewFinding["severity"],
    title: string,
    description: string,
    evidence: Record<string, unknown>,
    recommendation: string,
    blocking: boolean,
  ): ArchitectureReviewFinding {
    return {
      id: randomUUID(),
      category,
      severity,
      title,
      description,
      evidence,
      recommendation,
      blocking,
    };
  }
}