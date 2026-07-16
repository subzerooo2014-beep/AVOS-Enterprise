import { Injectable } from "@nestjs/common";
import { EnterpriseBrainFinalCertification } from "../enterprise-brain-mega-pack-7.types";
import { EnterpriseBrainCrossValidationService } from "../validation/enterprise-brain-cross-validation.service";
import { EnterpriseBrainManifestService } from "../manifest/enterprise-brain-manifest.service";
import { EnterpriseBrainEvidenceVaultService } from "../evidence/enterprise-brain-evidence-vault.service";
import { EnterpriseBrainFinalAuditService } from "../observability/enterprise-brain-final-audit.service";

@Injectable()
export class EnterpriseBrainCertificationService {
  private readonly certifications =
    new Map<string, EnterpriseBrainFinalCertification>();

  constructor(
    private readonly validation: EnterpriseBrainCrossValidationService,
    private readonly manifests: EnterpriseBrainManifestService,
    private readonly evidence: EnterpriseBrainEvidenceVaultService,
    private readonly audit: EnterpriseBrainFinalAuditService
  ) {}

  list() {
    return Array.from(this.certifications.values());
  }

  get(id: string) {
    const certification = this.certifications.get(id);

    if (!certification) {
      throw new Error(`Enterprise Brain certification not found: ${id}`);
    }

    return certification;
  }

  latest() {
    const items = this.list();

    return items.length === 0
      ? undefined
      : items[items.length - 1];
  }

  issue(input: {
    validationReportId: string;
    manifestId: string;
    certifiedByIdentityId: string;
    approvedByIdentityId: string;
    correlationId: string;
  }) {
    const report = this.validation.get(input.validationReportId);
    const manifest = this.manifests.get(input.manifestId);
    const evidenceSummary = this.evidence.summary();

    const reasons: string[] = [];
    const conditions: string[] = [];

    let status: EnterpriseBrainFinalCertification["status"] = "pending";

    if (!report.success) {
      status = "revoked";
      reasons.push("Enterprise Brain cross-validation failed.");
    }
    else if (report.score < 100 || evidenceSummary.failed > 0) {
      status = "conditional";
      conditions.push("Resolve validation or evidence conditions.");
    }
    else {
      status = "certified";
      reasons.push(
        "All Enterprise Brain Mega Packs passed final validation."
      );
    }

    const certification: EnterpriseBrainFinalCertification = {
      id: `enterprise-brain-certification:${Date.now()}:${
        this.certifications.size + 1
      }`,
      validationReportId: report.id,
      manifestId: manifest.id,
      status,
      score: report.score,
      certifiedByIdentityId: input.certifiedByIdentityId,
      approvedByIdentityId: input.approvedByIdentityId,
      reasons,
      conditions,
      correlationId: input.correlationId,
      createdAt: new Date().toISOString()
    };

    this.certifications.set(certification.id, certification);

    if (status === "certified") {
      this.manifests.certify(manifest.id);
    }

    this.audit.record({
      correlationId: input.correlationId,
      category: "certification",
      action: "enterprise-brain-certification-issued",
      subjectId: certification.id,
      actorIdentityId: input.approvedByIdentityId,
      outcome:
        status === "certified"
          ? "success"
          : status === "conditional"
            ? "warning"
            : "failure",
      metadata: {
        status,
        score: certification.score
      }
    });

    return certification;
  }

  summary() {
    const items = this.list();

    return {
      total: items.length,
      certified: items.filter((x) => x.status === "certified").length,
      conditional: items.filter((x) => x.status === "conditional").length,
      revoked: items.filter((x) => x.status === "revoked").length
    };
  }
}
