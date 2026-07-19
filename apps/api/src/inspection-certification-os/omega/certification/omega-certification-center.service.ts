import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { OmegaAssessment } from "../omega.types";

export interface OmegaCertificate {
  readonly certificateId: string;
  readonly assessmentId: string;
  readonly level: string;
  readonly issuedAt: string;
  readonly status: "pending-human-approval" | "approved" | "rejected";
  readonly humanFinalAuthority: true;
}

@Injectable()
export class OmegaCertificationCenterService {
  private readonly certificates: OmegaCertificate[] = [];

  issue(
    assessment: OmegaAssessment,
    readinessLevel: string,
  ): OmegaCertificate {
    const certificate: OmegaCertificate = {
      certificateId: `OMEGA-CERT-${randomUUID()}`,
      assessmentId: assessment.assessmentId,
      level: readinessLevel,
      issuedAt: new Date().toISOString(),
      status: "pending-human-approval",
      humanFinalAuthority: true,
    };

    this.certificates.unshift(certificate);
    return certificate;
  }

  list(): readonly OmegaCertificate[] {
    return [...this.certificates];
  }
}
