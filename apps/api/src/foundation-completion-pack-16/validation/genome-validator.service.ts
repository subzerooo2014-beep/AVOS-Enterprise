import { createHash } from "crypto";
import { Injectable } from "@nestjs/common";
import {
  GenomeValidationFinding
} from "../foundation-pack-16.types";
import { EnterpriseDigitalGenomeRegistryService } from "../genome/enterprise-digital-genome-registry.service";
import { GenomeAuditService } from "../observability/genome-audit.service";

@Injectable()
export class GenomeValidatorService {
  private readonly findings:
    GenomeValidationFinding[] = [];

  constructor(
    private readonly registry: EnterpriseDigitalGenomeRegistryService,
    private readonly audit: GenomeAuditService
  ) {}

  validate(input: {
    actorIdentityId: string;
    correlationId: string;
  }) {
    this.findings.length = 0;

    for (const genome of this.registry.list()) {
      if (!/^\d+\.\d+\.\d+$/.test(genome.version)) {
        this.add(
          genome.id,
          "error",
          "version-invalid",
          `Genome version is invalid: ${genome.version}.`,
          []
        );
      }

      const layerNames = new Set(
        genome.layers.map((layer) => layer.layer)
      );

      for (const required of [
        "architecture",
        "capabilities",
        "security",
        "governance",
        "ai",
        "integrations",
        "products",
        "ecosystem",
        "evolution"
      ]) {
        if (!layerNames.has(required as never)) {
          this.add(
            genome.id,
            "critical",
            "missing-layer",
            `Required genome layer is missing: ${required}.`,
            [required]
          );
        }
      }

      const dnaIds = genome.layers.flatMap(
        (layer) =>
          layer.dnaReferences.map(
            (reference) => reference.dnaId
          )
      );

      const duplicates = dnaIds.filter(
        (id, index) => dnaIds.indexOf(id) !== index
      );

      for (const id of Array.from(new Set(duplicates))) {
        this.add(
          genome.id,
          "error",
          "duplicate-dna",
          `Digital DNA is duplicated across genome layers: ${id}.`,
          [id]
        );
      }

      for (const layer of genome.layers) {
        if (
          layer.dnaReferences.length > 0 &&
          layer.completenessScore < 70
        ) {
          this.add(
            genome.id,
            "warning",
            "incomplete-layer",
            `Genome layer ${layer.layer} is incomplete.`,
            layer.dnaReferences.map(
              (reference) => reference.dnaId
            )
          );
        }

        for (const reference of layer.dnaReferences) {
          if (
            !reference.dnaId.trim() ||
            !reference.identityId.trim() ||
            !reference.version.trim()
          ) {
            this.add(
              genome.id,
              "error",
              "missing-dna-reference",
              `Invalid DNA reference in layer ${layer.layer}.`,
              [reference.dnaId]
            );
          }
        }
      }

      for (const relation of genome.crossLayerRelations) {
        if (
          !dnaIds.includes(relation.fromDnaId) ||
          !dnaIds.includes(relation.toDnaId)
        ) {
          this.add(
            genome.id,
            "error",
            "invalid-cross-layer-relation",
            "Cross-layer relation references missing DNA.",
            [
              relation.fromDnaId,
              relation.toDnaId
            ]
          );
        }
      }

      const activeLayers = genome.layers.filter(
        (layer) => layer.dnaReferences.length > 0
      );

      if (activeLayers.length > 1) {
        const counts = activeLayers.map(
          (layer) => layer.dnaReferences.length
        );

        const max = Math.max(...counts);
        const min = Math.min(...counts);

        if (max > Math.max(1, min) * 5) {
          this.add(
            genome.id,
            "warning",
            "unbalanced-composition",
            "Genome composition is highly unbalanced.",
            activeLayers.map(
              (layer) => layer.layer
            )
          );
        }
      }

      const {
        checksum,
        ...withoutChecksum
      } = genome;

      const calculated = createHash("sha256")
        .update(JSON.stringify(withoutChecksum))
        .digest("hex");

      if (calculated !== checksum) {
        this.add(
          genome.id,
          "critical",
          "checksum-mismatch",
          "Enterprise genome checksum mismatch.",
          []
        );
      }
    }

    this.audit.record({
      correlationId: input.correlationId,
      category: "validation",
      action: "enterprise-genome-validated",
      subjectId: "enterprise-digital-genome",
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
      valid: !this.findings.some(
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

  private add(
    genomeId: string,
    severity: GenomeValidationFinding["severity"],
    code: GenomeValidationFinding["code"],
    message: string,
    relatedIds: string[]
  ) {
    this.findings.push({
      id: `genome-validation:${Date.now()}:${
        this.findings.length + 1
      }`,
      genomeId,
      severity,
      code,
      message,
      relatedIds,
      createdAt: new Date().toISOString()
    });
  }
}
