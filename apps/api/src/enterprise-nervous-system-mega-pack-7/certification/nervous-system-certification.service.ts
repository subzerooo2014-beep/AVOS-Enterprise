import { Injectable } from "@nestjs/common";
import { NervousSystemFinalCertification } from "../enterprise-nervous-system-mega-pack-7.types";
import { NervousSystemCrossValidationService } from "../validation/nervous-system-cross-validation.service";
import { NervousSystemManifestService } from "../manifest/nervous-system-manifest.service";
import { NervousSystemEvidenceVaultService } from "../evidence/nervous-system-evidence-vault.service";
import { NervousSystemFinalAuditService } from "../observability/nervous-system-final-audit.service";

@Injectable()
export class NervousSystemCertificationService {
  private readonly certifications =
    new Map<string, NervousSystemFinalCertification>();

  constructor(
    private readonly validation: NervousSystemCrossValidationService,
    private readonly manifests: NervousSystemManifestService,
    private readonly evidence: NervousSystemEvidenceVaultService,
    private readonly audit: NervousSystemFinalAuditService
  ) {}

  list() {
    return Array.from(this.certifications.values());
  }

  get(id: string) {
    const certification = this.certifications.get(id);

    if (!certification) {
      throw new Error(
        `Enterprise Nervous System certification not found: ${id}`
      );
    }

    return certification;
  }

  latest() {
    const items = this.list();
    return items.length === 0 ? undefined : items[items.length - 1];
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

    let status: NervousSystemFinalCertification["status"] = "pending";

    if (!report.success) {
      status = "revoked";
      reasons.push(
        "Enterprise Nervous System cross-validation failed."
      );
    }
    else if (report.score < 100 || evidenceSummary.failed > 0) {
      status = "conditional";
      conditions.push(
        "Resolve validation or evidence conditions."
      );
    }
    else {
      status = "certified";
      reasons.push(
        "All Enterprise Nervous System Mega Packs passed final validation."
      );
    }

    const certification: NervousSystemFinalCertification = {
      id: `nervous-system-certification:${Date.now()}:${
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
      action: "nervous-system-certification-issued",
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
