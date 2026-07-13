import { Injectable } from "@nestjs/common";
import { CoreFlowStandardsRegistryService } from "./core-flow-standards-registry.service";
import { CoreFlowConformanceService } from "./core-flow-conformance.service";
import { CoreFlowCertificationService } from "./core-flow-certification.service";
import { CoreFlowCompatibilityService } from "./core-flow-compatibility.service";
import { CoreFlowAuditService } from "./core-flow-audit.service";

@Injectable()
export class CoreFlowStandardsGovernanceService {
  constructor(
    private readonly standards: CoreFlowStandardsRegistryService,
    private readonly conformance: CoreFlowConformanceService,
    private readonly certifications: CoreFlowCertificationService,
    private readonly compatibility: CoreFlowCompatibilityService,
    private readonly audit: CoreFlowAuditService,
  ) {}

  validateAndCertify(executionId: string, dto: any = {}) {
    const result = this.certifications.issue(
      executionId,
      String(dto?.standardId),
      Array.isArray(dto?.capabilities) ? dto.capabilities : [],
      Number(dto?.validityDays ?? 365),
    );

    const audit = this.audit.write(
      executionId,
      "standards.certification-evaluated",
      {
        standardId: dto?.standardId,
        issued: result.issued,
      },
      String(dto?.actor ?? "system"),
    );

    return {
      ...result,
      audit,
      evaluatedAt: new Date().toISOString(),
    };
  }

  dashboard() {
    return {
      standards: this.standards.findAll(),
      conformance: this.conformance.dashboard(),
      certifications: this.certifications.findAll(),
      compatibility: this.compatibility.dashboard(),
      generatedAt: new Date().toISOString(),
    };
  }
}
