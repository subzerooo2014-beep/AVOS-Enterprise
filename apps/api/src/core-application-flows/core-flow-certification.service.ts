import { Injectable, NotFoundException } from "@nestjs/common";
import type { FlowCertification } from "./core-flow-standards.types";
import { CoreFlowConformanceService } from "./core-flow-conformance.service";

@Injectable()
export class CoreFlowCertificationService {
  private readonly certifications = new Map<string, FlowCertification>();

  constructor(
    private readonly conformance: CoreFlowConformanceService,
  ) {}

  issue(
    executionId: string,
    standardId: string,
    capabilities: string[],
    validityDays = 365,
  ) {
    const test = this.conformance.test(
      executionId,
      standardId,
      capabilities,
    );

    if (!test.result.passed) {
      return {
        issued: false,
        reason: "Conformance test failed.",
        conformance: test,
      };
    }

    const issuedAt = new Date();
    const expiresAt = new Date(
      issuedAt.getTime() +
        Math.max(Number(validityDays), 1) * 24 * 60 * 60 * 1000,
    );

    const certification: FlowCertification = {
      id: `cert_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      executionId,
      standardId,
      certificateNumber: `AVOS-CERT-${Date.now()}`,
      status: "issued",
      issuedAt: issuedAt.toISOString(),
      expiresAt: expiresAt.toISOString(),
    };

    this.certifications.set(certification.id, certification);

    return {
      issued: true,
      certification,
      conformance: test,
    };
  }

  findAll(query: any = {}) {
    return Array.from(this.certifications.values())
      .filter(
        (item) =>
          !query.executionId || item.executionId === query.executionId,
      )
      .filter(
        (item) =>
          !query.standardId || item.standardId === query.standardId,
      )
      .filter((item) => !query.status || item.status === query.status)
      .slice()
      .reverse();
  }

  findOne(id: string) {
    const certification = this.certifications.get(id);
    if (!certification) {
      throw new NotFoundException("Flow certification not found");
    }
    return certification;
  }

  suspend(id: string) {
    const certification = this.findOne(id);
    certification.status = "suspended";
    return certification;
  }

  revoke(id: string) {
    const certification = this.findOne(id);
    certification.status = "revoked";
    return certification;
  }
}
