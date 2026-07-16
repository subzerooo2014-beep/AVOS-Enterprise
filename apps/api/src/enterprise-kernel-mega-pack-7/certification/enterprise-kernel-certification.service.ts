import { Injectable } from "@nestjs/common";
import { KernelFinalCertification } from "../enterprise-kernel-mega-pack-7.types";
import { EnterpriseKernelCrossValidationService } from "../validation/enterprise-kernel-cross-validation.service";
import { KernelEvidenceVaultService } from "../evidence/kernel-evidence-vault.service";
import { EnterpriseKernelFinalAuditService } from "../observability/enterprise-kernel-final-audit.service";

@Injectable()
export class EnterpriseKernelCertificationService {
  private readonly certifications =
    new Map<string, KernelFinalCertification>();

  constructor(
    private readonly validation: EnterpriseKernelCrossValidationService,
    private readonly evidence: KernelEvidenceVaultService,
    private readonly audit: EnterpriseKernelFinalAuditService
  ) {}

  list() {
    return Array.from(this.certifications.values());
  }

  issue(input: {
    validationReportId: string;
    certifiedByIdentityId: string;
    approvedByIdentityId: string;
    correlationId: string;
  }) {
    const report = this.validation.get(
      input.validationReportId
    );

    const evidenceSummary = this.evidence.summary();
    const reasons: string[] = [];
    const conditions: string[] = [];

    let status: KernelFinalCertification["status"] =
      "pending";

    if (!report.success) {
      status = "revoked";
      reasons.push(
        "Enterprise Kernel cross-validation failed."
      );
    }
    else if (report.score < 100) {
      status = "conditional";
      conditions.push(
        ...report.warnings
      );
    }
    else {
      status = "certified";
      reasons.push(
        "All Enterprise Kernel Mega Packs passed final validation."
      );
    }

    if (evidenceSummary.failed > 0) {
      status = "conditional";
      conditions.push(
        "Operational evidence contains failed items."
      );
    }

    const certification: KernelFinalCertification = {
      id: `enterprise-kernel-certification:${Date.now()}:${
        this.certifications.size + 1
      }`,
      validationReportId: report.id,
      status,
      score: report.score,
      certifiedByIdentityId:
        input.certifiedByIdentityId,
      approvedByIdentityId:
        input.approvedByIdentityId,
      reasons,
      conditions:
        Array.from(new Set(conditions)),
      correlationId: input.correlationId,
      createdAt: new Date().toISOString()
    };

    this.certifications.set(
      certification.id,
      certification
    );

    this.audit.record({
      correlationId: input.correlationId,
      category: "certification",
      action: "enterprise-kernel-certification-issued",
      subjectId: certification.id,
      actorIdentityId:
        input.approvedByIdentityId,
      outcome:
        certification.status === "certified"
          ? "success"
          : certification.status === "conditional"
            ? "warning"
            : "failure",
      metadata: {
        status: certification.status,
        score: certification.score
      }
    });

    return certification;
  }

  get(id: string) {
    const certification = this.certifications.get(id);

    if (!certification) {
      throw new Error(
        `Enterprise Kernel certification not found: ${id}`
      );
    }

    return certification;
  }

  latest() {
    const items = this.list();

    return items.length === 0
      ? undefined
      : items[items.length - 1];
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
