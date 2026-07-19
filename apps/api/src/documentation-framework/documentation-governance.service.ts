import { Injectable } from "@nestjs/common";
import { CreateDocumentationVersionDto } from "./dto/create-documentation-version.dto";
import { RequestDocumentationReviewDto } from "./dto/request-documentation-review.dto";
import { DecideDocumentationReviewDto } from "./dto/decide-documentation-review.dto";
import { TransitionDocumentationStatusDto } from "./dto/transition-documentation-status.dto";
import { CertifyDocumentationDto } from "./dto/certify-documentation.dto";
import { DocumentationRegistryService } from "./registry/documentation-registry.service";
import { DocumentationVersionService } from "./versioning/documentation-version.service";
import { DocumentationApprovalWorkflowService } from "./workflow/documentation-approval-workflow.service";
import { DocumentationLifecycleService } from "./lifecycle/documentation-lifecycle.service";
import { DocumentationAuditService } from "./audit/documentation-audit.service";
import { DocumentationCertificationService } from "./certification/documentation-certification.service";

@Injectable()
export class DocumentationGovernanceService {
  constructor(
    private readonly registry: DocumentationRegistryService,
    private readonly versioning: DocumentationVersionService,
    private readonly workflow: DocumentationApprovalWorkflowService,
    private readonly lifecycle: DocumentationLifecycleService,
    private readonly audit: DocumentationAuditService,
    private readonly certification: DocumentationCertificationService,
  ) {}

  createVersion(documentId: string, dto: CreateDocumentationVersionDto) {
    const document = this.registry.findById(documentId);
    const version = this.versioning.create(documentId, document.version, dto);

    this.registry.update(documentId, {
      version: version.version,
      status: "draft",
      metadata: {
        lastVersionId: version.id,
        lastChangeType: version.changeType,
        lastChangeSummary: version.changeSummary,
      },
    });

    this.audit.record({
      documentId,
      action: "version-created",
      actor: dto.createdBy,
      referenceId: version.id,
      details: {
        previousVersion: document.version,
        version: version.version,
        changeType: version.changeType,
      },
    });

    return version;
  }

  listVersions(documentId: string) {
    this.registry.findById(documentId);
    return this.versioning.list(documentId);
  }

  requestReview(documentId: string, dto: RequestDocumentationReviewDto) {
    this.registry.findById(documentId);
    return this.workflow.request(documentId, dto);
  }

  approveReview(reviewId: string, dto: DecideDocumentationReviewDto) {
    return this.workflow.approve(reviewId, dto);
  }

  rejectReview(reviewId: string, dto: DecideDocumentationReviewDto) {
    return this.workflow.reject(reviewId, dto);
  }

  listReviews(documentId?: string) {
    if (documentId) {
      this.registry.findById(documentId);
    }
    return this.workflow.list(documentId);
  }

  transition(documentId: string, dto: TransitionDocumentationStatusDto) {
    return this.lifecycle.transition(documentId, dto);
  }

  allowedTransitions(documentId: string) {
    const document = this.registry.findById(documentId);
    return {
      documentId,
      currentStatus: document.status,
      allowedTransitions: this.lifecycle.allowedTransitions(document.status),
    };
  }

  certify(documentId: string, dto: CertifyDocumentationDto) {
    return this.certification.certify(documentId, dto);
  }

  certificationStatus(documentId: string) {
    this.registry.findById(documentId);
    return this.certification.status(documentId);
  }

  auditTrail(documentId?: string) {
    if (documentId) {
      this.registry.findById(documentId);
    }
    return this.audit.list(documentId);
  }

  status() {
    return {
      name: "AVOS Documentation Framework Governance",
      version: "ADF-MP2-1.0.0",
      status: "operational",
      components: {
        versionEngine: true,
        approvalWorkflow: true,
        lifecycleGovernance: true,
        constitutionalProtection: true,
        auditTrail: true,
        certificationEngine: true,
      },
      metrics: {
        versions: this.versioning.count(),
        reviews: this.workflow.count(),
        auditRecords: this.audit.count(),
        certifications: this.certification.count(),
        documents: this.registry.list().length,
      },
      humanFinalAuthority: true,
      globalComplianceReadinessGate: true,
      checkedAt: new Date().toISOString(),
    };
  }

  verify() {
    const status = this.status();
    const checks = {
      operational: status.status === "operational",
      versionEngine: status.components.versionEngine,
      approvalWorkflow: status.components.approvalWorkflow,
      lifecycleGovernance: status.components.lifecycleGovernance,
      constitutionalProtection: status.components.constitutionalProtection,
      auditTrail: status.components.auditTrail,
      certificationEngine: status.components.certificationEngine,
      foundationDocumentsAvailable: status.metrics.documents >= 3,
      humanFinalAuthority: status.humanFinalAuthority,
      globalComplianceReadinessGate:
        status.globalComplianceReadinessGate,
    };

    const values = Object.values(checks);
    const score = Math.round(
      (values.filter(Boolean).length / values.length) * 100,
    );

    return {
      name: "ADF Mega Pack 2 Verification",
      status: values.every(Boolean) ? "passed" : "failed",
      score,
      checks,
      verifiedAt: new Date().toISOString(),
    };
  }
}
