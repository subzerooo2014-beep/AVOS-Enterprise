import {
  BadRequestException,
  Injectable
} from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  AvosFactoryCertificate
} from "./avos-factory-certification-integration.contracts";
import {
  AvosFactoryCertificationAssessmentService
} from "./avos-factory-certification-assessment.service";
import {
  AvosFactoryAuditService
} from "./avos-factory-audit.service";

@Injectable()
export class AvosFactoryCertificateRegistryService {
  private readonly certificates: AvosFactoryCertificate[] = [];

  constructor(
    private readonly assessments: AvosFactoryCertificationAssessmentService,
    private readonly audit: AvosFactoryAuditService
  ) {}

  issue(input: {
    assessmentId: string;
    subjectId: string;
    version: string;
    actor: string;
    approvedBy: string;
    humanApproved: boolean;
    expiresAt?: string;
  }): AvosFactoryCertificate {
    if (!input.humanApproved || !input.approvedBy?.trim()) {
      throw new BadRequestException(
        "Certificate issuance requires Human Final Authority approval."
      );
    }

    const assessment = this.assessments.get(input.assessmentId);

    if (!assessment) {
      throw new BadRequestException(
        `Certification assessment not found: ${input.assessmentId}`
      );
    }

    if (assessment.status !== "eligible") {
      throw new BadRequestException(
        "Only eligible assessments can be certified."
      );
    }

    const certificate: AvosFactoryCertificate = {
      id: randomUUID(),
      subjectId: input.subjectId,
      assessmentId: input.assessmentId,
      version: input.version,
      status: "certified",
      score: assessment.score,
      issuedBy: input.actor,
      approvedBy: input.approvedBy,
      humanApproved: true,
      issuedAt: new Date().toISOString(),
      expiresAt: input.expiresAt
    };

    this.certificates.unshift(certificate);

    this.audit.append({
      category: "certification",
      action: "factory-certificate-issued",
      actor: input.actor,
      approvedBy: input.approvedBy,
      success: true,
      resourceId: certificate.id,
      details: {
        subjectId: input.subjectId,
        version: input.version,
        score: certificate.score
      }
    });

    return structuredClone(certificate);
  }

  revoke(input: {
    certificateId: string;
    actor: string;
    approvedBy: string;
    humanApproved: boolean;
    reason: string;
  }): AvosFactoryCertificate {
    if (!input.humanApproved || !input.approvedBy?.trim()) {
      throw new BadRequestException(
        "Certificate revocation requires Human Final Authority approval."
      );
    }

    const certificate = this.certificates.find(
      (candidate) => candidate.id === input.certificateId
    );

    if (!certificate) {
      throw new BadRequestException(
        `Certificate not found: ${input.certificateId}`
      );
    }

    certificate.status = "revoked";
    certificate.revokedAt = new Date().toISOString();
    certificate.revocationReason = input.reason;

    this.audit.append({
      category: "certification",
      action: "factory-certificate-revoked",
      actor: input.actor,
      approvedBy: input.approvedBy,
      success: true,
      resourceId: certificate.id,
      details: { reason: input.reason }
    });

    return structuredClone(certificate);
  }

  list(limit = 100): AvosFactoryCertificate[] {
    return this.certificates
      .slice(0, Math.max(1, Math.min(limit, 1000)))
      .map((certificate) => structuredClone(certificate));
  }

  get(certificateId: string): AvosFactoryCertificate | undefined {
    const certificate = this.certificates.find(
      (candidate) => candidate.id === certificateId
    );

    return certificate ? structuredClone(certificate) : undefined;
  }
}
