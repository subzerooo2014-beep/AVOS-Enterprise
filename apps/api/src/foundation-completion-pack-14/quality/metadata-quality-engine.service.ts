import { Injectable } from "@nestjs/common";
import {
  MetadataQualityFinding
} from "../foundation-pack-14.types";
import { UnifiedMetadataCatalogService } from "../catalog/unified-metadata-catalog.service";
import { MetadataLineageService } from "../lineage/metadata-lineage.service";
import { MetadataAuditService } from "../observability/metadata-audit.service";

@Injectable()
export class MetadataQualityEngineService {
  private readonly findings:
    MetadataQualityFinding[] = [];

  constructor(
    private readonly catalog: UnifiedMetadataCatalogService,
    private readonly lineage: MetadataLineageService,
    private readonly audit: MetadataAuditService
  ) {}

  validate(input: {
    actorIdentityId: string;
    correlationId: string;
  }) {
    this.findings.length = 0;

    const records = this.catalog.list();

    for (const record of records) {
      let qualityScore = 100;

      if (!record.ownerIdentityId.trim()) {
        qualityScore -= 20;
        this.add(
          "error",
          "missing-owner",
          record.id,
          "Metadata owner is required.",
          []
        );
      }

      if (!record.description.trim()) {
        qualityScore -= 20;
        this.add(
          "error",
          "missing-description",
          record.id,
          "Metadata description is required.",
          []
        );
      }

      if (!record.domain.trim()) {
        qualityScore -= 15;
        this.add(
          "warning",
          "missing-domain",
          record.id,
          "Metadata domain is required.",
          []
        );
      }

      if (!record.version.trim()) {
        qualityScore -= 15;
        this.add(
          "warning",
          "missing-version",
          record.id,
          "Metadata version is required.",
          []
        );
      }

      if (record.confidence < 50) {
        qualityScore -= 10;
        this.add(
          "warning",
          "low-confidence",
          record.id,
          `Metadata confidence is low: ${record.confidence}.`,
          []
        );
      }

      const duplicates = records.filter(
        (candidate) =>
          candidate.id !== record.id &&
          candidate.assetType === record.assetType &&
          candidate.canonicalName.toLowerCase() ===
            record.canonicalName.toLowerCase()
      );

      if (duplicates.length > 0) {
        qualityScore -= 20;
        this.add(
          "error",
          "duplicate-record",
          record.id,
          `Duplicate metadata record detected: ${record.canonicalName}.`,
          duplicates.map((item) => item.id)
        );
      }

      if (!this.lineage.hasLineage(record.id)) {
        qualityScore -= 5;
        this.add(
          "info",
          "orphan-record",
          record.id,
          "Metadata record has no lineage.",
          []
        );
      }

      qualityScore = Math.max(
        0,
        Math.min(100, qualityScore)
      );

      if (qualityScore < 50) {
        this.add(
          "critical",
          "low-quality",
          record.id,
          `Metadata quality is critically low: ${qualityScore}.`,
          []
        );
      }

      this.catalog.update(
        record.id,
        { qualityScore },
        {
          actorIdentityId: input.actorIdentityId,
          correlationId: input.correlationId
        }
      );
    }

    this.audit.record({
      correlationId: input.correlationId,
      category: "quality",
      action: "metadata-quality-validated",
      subjectId: "unified-metadata-catalog",
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
    severity: MetadataQualityFinding["severity"],
    code: MetadataQualityFinding["code"],
    metadataId: string,
    message: string,
    relatedIds: string[]
  ) {
    this.findings.push({
      id: `metadata-quality:${Date.now()}:${
        this.findings.length + 1
      }`,
      metadataId,
      severity,
      code,
      message,
      relatedIds,
      createdAt: new Date().toISOString()
    });
  }
}
