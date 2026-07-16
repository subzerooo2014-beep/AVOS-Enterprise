import { createHash } from "crypto";
import { Injectable } from "@nestjs/common";
import {
  DigitalDnaValidationFinding
} from "../foundation-pack-15.types";
import { DigitalDnaRegistryService } from "../dna/digital-dna-registry.service";
import { DigitalDnaAuditService } from "../observability/digital-dna-audit.service";

@Injectable()
export class DigitalDnaValidatorService {
  private readonly findings:
    DigitalDnaValidationFinding[] = [];

  constructor(
    private readonly registry: DigitalDnaRegistryService,
    private readonly audit: DigitalDnaAuditService
  ) {}

  validate(input: {
    actorIdentityId: string;
    correlationId: string;
  }) {
    this.findings.length = 0;

    for (const dna of this.registry.list()) {
      if (!dna.identity.identityId.trim()) {
        this.add(
          dna.id,
          "critical",
          "identity-missing",
          "Digital DNA identity is required.",
          []
        );
      }

      if (!dna.identity.ownerIdentityId.trim()) {
        this.add(
          dna.id,
          "critical",
          "owner-missing",
          "Digital DNA owner is required.",
          []
        );
      }

      if (
        !dna.purpose.mission.trim() ||
        !dna.purpose.problemSolved.trim() ||
        dna.purpose.valueCreated.length === 0
      ) {
        this.add(
          dna.id,
          "error",
          "purpose-incomplete",
          "Digital DNA purpose is incomplete.",
          []
        );
      }

      for (const contract of dna.contracts) {
        if (
          !contract.id.trim() ||
          !contract.version.trim() ||
          !contract.providerIdentityId.trim()
        ) {
          this.add(
            dna.id,
            "error",
            "contract-invalid",
            `Invalid contract in DNA: ${contract.id}.`,
            [contract.id]
          );
        }
      }

      for (const dependency of dna.dependencies) {
        if (!dependency.assetId.trim()) {
          this.add(
            dna.id,
            "error",
            "dependency-invalid",
            "Dependency asset identifier is required.",
            []
          );
        }
      }

      if (
        dna.status === "active" &&
        dna.policies.length === 0
      ) {
        this.add(
          dna.id,
          "warning",
          "policy-missing",
          "Active Digital DNA has no policy bindings.",
          []
        );
      }

      for (const permission of dna.permissions) {
        if (permission.actions.length === 0) {
          this.add(
            dna.id,
            "warning",
            "permission-empty",
            `Permission has no actions for ${permission.principalIdentityId}.`,
            [permission.principalIdentityId]
          );
        }
      }

      for (const metric of dna.metrics) {
        if (!metric.name.trim() || !metric.unit.trim()) {
          this.add(
            dna.id,
            "warning",
            "metric-incomplete",
            `Metric is incomplete: ${metric.id}.`,
            [metric.id]
          );
        }
      }

      if (!this.validVersion(dna.version)) {
        this.add(
          dna.id,
          "error",
          "version-invalid",
          `Digital DNA version is invalid: ${dna.version}.`,
          []
        );
      }

      const {
        checksum,
        ...withoutChecksum
      } = dna;

      const calculated = createHash("sha256")
        .update(JSON.stringify(withoutChecksum))
        .digest("hex");

      if (calculated !== checksum) {
        this.add(
          dna.id,
          "critical",
          "checksum-mismatch",
          "Digital DNA checksum mismatch.",
          []
        );
      }
    }

    this.audit.record({
      correlationId: input.correlationId,
      category: "validation",
      action: "digital-dna-validated",
      subjectId: "digital-dna-framework",
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

  private validVersion(value: string) {
    return /^\d+\.\d+\.\d+$/.test(value);
  }

  private add(
    dnaId: string,
    severity: DigitalDnaValidationFinding["severity"],
    code: DigitalDnaValidationFinding["code"],
    message: string,
    relatedIds: string[]
  ) {
    this.findings.push({
      id: `digital-dna-validation:${Date.now()}:${
        this.findings.length + 1
      }`,
      dnaId,
      severity,
      code,
      message,
      relatedIds,
      createdAt: new Date().toISOString()
    });
  }
}
