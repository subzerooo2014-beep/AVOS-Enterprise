import {
  Injectable,
  NotFoundException
} from "@nestjs/common";
import {
  FoundationCertification
} from "../foundation-pack-20.types";
import { CrossFoundationValidationService } from "../validation/cross-foundation-validation.service";
import { FoundationPackRegistryService } from "../registry/foundation-pack-registry.service";
import { FoundationFinalAuditService } from "../observability/foundation-final-audit.service";

@Injectable()
export class FoundationCertificationService {
  private readonly certifications =
    new Map<string, FoundationCertification>();

  constructor(
    private readonly validation: CrossFoundationValidationService,
    private readonly registry: FoundationPackRegistryService,
    private readonly audit: FoundationFinalAuditService
  ) {}

  list() {
    return Array.from(this.certifications.values());
  }

  get(id: string) {
    const certification =
      this.certifications.get(id);

    if (!certification) {
      throw new NotFoundException(
        `Foundation certification not found: ${id}`
      );
    }

    return certification;
  }

  issue(input: {
    validationReportId: string;
    certifiedByIdentityId: string;
    approvedByIdentityId?: string;
    correlationId: string;
    expiresAt?: string;
  }) {
    const report = this.validation
      .list()
      .find(
        (item) => item.id === input.validationReportId
      );

    if (!report) {
      throw new Error(
        `Cross-foundation validation report not found: ${input.validationReportId}`
      );
    }

    if (!report.success) {
      throw new Error(
        "Foundation certification cannot be issued because validation failed."
      );
    }

    if (!input.approvedByIdentityId) {
      throw new Error(
        "Final foundation certification requires explicit human approval."
      );
    }

    const conditions: string[] = [];
    const restrictions: string[] = [];

    if (report.score < 100) {
      conditions.push(
        "Resolve all non-blocking findings in the next controlled release."
      );
    }

    restrictions.push(
      "Higher-layer execution must follow approved roadmap sequencing."
    );

    const certification: FoundationCertification = {
      id: `foundation-certification:${Date.now()}:${
        this.certifications.size + 1
      }`,
      name: "AVOS Foundation Final Certification",
      version: "1.0.0",
      status:
        report.score >= 95
          ? "certified"
          : "conditionally-certified",
      validationReportId: report.id,
      certifiedPackIds:
        this.registry.required().map((pack) => pack.id),
      score: report.score,
      conditions,
      restrictions,
      certifiedByIdentityId:
        input.certifiedByIdentityId,
      approvedByIdentityId:
        input.approvedByIdentityId,
      issuedAt: new Date().toISOString(),
      expiresAt: input.expiresAt
    };

    this.certifications.set(
      certification.id,
      certification
    );

    this.audit.record({
      correlationId: input.correlationId,
      category: "certification",
      action: "foundation-certification-issued",
      subjectId: certification.id,
      actorIdentityId:
        input.certifiedByIdentityId,
      outcome:
        certification.status === "certified"
          ? "success"
          : "warning",
      metadata: {
        status: certification.status,
        score: certification.score,
        approvedByIdentityId:
          certification.approvedByIdentityId
      }
    });

    return certification;
  }

  revoke(input: {
    certificationId: string;
    actorIdentityId: string;
    correlationId: string;
    reason: string;
  }) {
    const current = this.get(
      input.certificationId
    );

    const updated: FoundationCertification = {
      ...current,
      status: "revoked",
      conditions: Array.from(
        new Set([
          ...current.conditions,
          `Revoked: ${input.reason}`
        ])
      )
    };

    this.certifications.set(
      updated.id,
      updated
    );

    this.audit.record({
      correlationId: input.correlationId,
      category: "certification",
      action: "foundation-certification-revoked",
      subjectId: updated.id,
      actorIdentityId: input.actorIdentityId,
      outcome: "warning",
      metadata: {
        reason: input.reason
      }
    });

    return updated;
  }

  summary() {
    const certifications = this.list();

    return {
      total: certifications.length,
      certified: certifications.filter(
        (item) => item.status === "certified"
      ).length,
      conditional: certifications.filter(
        (item) =>
          item.status === "conditionally-certified"
      ).length,
      revoked: certifications.filter(
        (item) => item.status === "revoked"
      ).length
    };
  }
}
