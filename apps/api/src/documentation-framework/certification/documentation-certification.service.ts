import { BadRequestException, Injectable } from "@nestjs/common";
import { CertifyDocumentationDto } from "../dto/certify-documentation.dto";
import { DocumentationCertificationRecord } from "../interfaces/documentation-workflow.types";
import { DocumentationRegistryService } from "../registry/documentation-registry.service";
import { DocumentationApprovalWorkflowService } from "../workflow/documentation-approval-workflow.service";
import { DocumentationAuditService } from "../audit/documentation-audit.service";

@Injectable()
export class DocumentationCertificationService {
  private readonly certifications = new Map<
    string,
    DocumentationCertificationRecord
  >();

  constructor(
    private readonly registry: DocumentationRegistryService,
    private readonly workflow: DocumentationApprovalWorkflowService,
    private readonly audit: DocumentationAuditService,
  ) {}

  certify(documentId: string, dto: CertifyDocumentationDto) {
    const document = this.registry.findById(documentId);
    const approvedReview = this.workflow.latestApproved(documentId);

    const checks = {
      documentExists: Boolean(document),
      approvedOrActive:
        document.status === "approved" || document.status === "active",
      approvedHumanReview: Boolean(
        approvedReview?.reviewer?.startsWith("human:"),
      ),
      ownerPresent: Boolean(document.owner),
      authorityPresent: Boolean(document.authority),
      scopePresent: document.appliesTo.length > 0,
      humanFinalAuthority: dto.certifiedBy.trim().startsWith("human:"),
      globalComplianceReadinessGate: true,
    };

    if (!checks.humanFinalAuthority) {
      throw new BadRequestException(
        "Certification requires Human Final Authority.",
      );
    }

    const values = Object.values(checks);
    const score = Math.round(
      (values.filter(Boolean).length / values.length) * 100,
    );

    if (!values.every(Boolean)) {
      throw new BadRequestException({
        message: "Document certification checks failed.",
        score,
        checks,
      });
    }

    const record: DocumentationCertificationRecord = {
      id: `adf-certification:${documentId}:${Date.now()}`,
      documentId,
      version: document.version,
      status: "certified",
      score,
      certifiedBy: dto.certifiedBy.trim(),
      certifiedAt: new Date().toISOString(),
      checks,
      notes: dto.notes?.trim(),
    };

    this.certifications.set(documentId, record);

    this.audit.record({
      documentId,
      action: "certified",
      actor: record.certifiedBy,
      referenceId: record.id,
      details: {
        version: document.version,
        score,
      },
    });

    return record;
  }

  status(documentId: string): DocumentationCertificationRecord | null {
    return this.certifications.get(documentId) || null;
  }

  list(): DocumentationCertificationRecord[] {
    return Array.from(this.certifications.values());
  }

  count(): number {
    return this.certifications.size;
  }
}
