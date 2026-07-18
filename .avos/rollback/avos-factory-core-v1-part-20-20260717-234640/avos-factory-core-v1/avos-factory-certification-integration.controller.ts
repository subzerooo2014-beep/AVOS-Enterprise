import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query
} from "@nestjs/common";
import {
  AvosFactoryCertificationCriteriaRegistryService
} from "./avos-factory-certification-criteria-registry.service";
import {
  AvosFactoryCertificationAssessmentService
} from "./avos-factory-certification-assessment.service";
import {
  AvosFactoryCertificateRegistryService
} from "./avos-factory-certificate-registry.service";
import {
  AvosFactoryReleaseGovernanceService
} from "./avos-factory-release-governance.service";
import {
  AvosFactoryCertificationIntegrationSmokeService
} from "./avos-factory-certification-integration-smoke.service";

@Controller("avos/factory/v1/certification")
export class AvosFactoryCertificationIntegrationController {
  constructor(
    private readonly criteria: AvosFactoryCertificationCriteriaRegistryService,
    private readonly assessments: AvosFactoryCertificationAssessmentService,
    private readonly certificates: AvosFactoryCertificateRegistryService,
    private readonly governance: AvosFactoryReleaseGovernanceService,
    private readonly smoke: AvosFactoryCertificationIntegrationSmokeService
  ) {}

  @Get("criteria")
  criteriaList() {
    return { items: this.criteria.list() };
  }

  @Post("criteria")
  registerCriterion(
    @Body()
    input: Parameters<
      AvosFactoryCertificationCriteriaRegistryService["register"]
    >[0]
  ) {
    return this.criteria.register(input);
  }

  @Post("assessments/run")
  runAssessment(
    @Body()
    input: Parameters<
      AvosFactoryCertificationAssessmentService["assess"]
    >[0]
  ) {
    return this.assessments.assess(input);
  }

  @Get("assessments")
  assessmentList(@Query("limit") limit?: string) {
    const parsed = Number(limit);

    return {
      items: this.assessments.list(
        Number.isFinite(parsed) ? Math.trunc(parsed) : 100
      )
    };
  }

  @Post("certificates/issue")
  issueCertificate(
    @Body()
    input: Parameters<AvosFactoryCertificateRegistryService["issue"]>[0]
  ) {
    return this.certificates.issue(input);
  }

  @Post("certificates/:id/revoke")
  revokeCertificate(
    @Param("id") id: string,
    @Body()
    body: {
      actor: string;
      approvedBy: string;
      humanApproved: boolean;
      reason: string;
    }
  ) {
    return this.certificates.revoke({
      certificateId: id,
      ...body
    });
  }

  @Get("certificates")
  certificateList(@Query("limit") limit?: string) {
    const parsed = Number(limit);

    return {
      items: this.certificates.list(
        Number.isFinite(parsed) ? Math.trunc(parsed) : 100
      )
    };
  }

  @Post("release-governance/decide")
  decideRelease(
    @Body()
    input: Parameters<AvosFactoryReleaseGovernanceService["decide"]>[0]
  ) {
    return this.governance.decide(input);
  }

  @Get("release-governance/decisions")
  governanceList(@Query("limit") limit?: string) {
    const parsed = Number(limit);

    return {
      items: this.governance.list(
        Number.isFinite(parsed) ? Math.trunc(parsed) : 100
      )
    };
  }

  @Post("smoke/run")
  smokeRun() {
    return this.smoke.run();
  }
}
