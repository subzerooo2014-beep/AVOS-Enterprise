import {
  Body,
  Controller,
  Get,
  Post,
} from "@nestjs/common";
import { AdaptiveGrowthApprovalGovernanceCertificationService } from "./adaptive-growth-approval-governance-certification.service";
import { AdaptiveGrowthApprovalGovernanceReadinessService } from "./adaptive-growth-approval-governance-readiness.service";
import { AdaptiveGrowthApprovalGovernanceVerificationService } from "./adaptive-growth-approval-governance-verification.service";

@Controller(
  "avos/products/adaptive-growth-studio/governance",
)
export class AdaptiveGrowthApprovalGovernanceOperationsController {
  constructor(
    private readonly verification:
      AdaptiveGrowthApprovalGovernanceVerificationService,
    private readonly readiness:
      AdaptiveGrowthApprovalGovernanceReadinessService,
    private readonly certification:
      AdaptiveGrowthApprovalGovernanceCertificationService,
  ) {}

  @Post("verification/run")
  verify() {
    return this.verification.run();
  }

  @Get("verification/status")
  verificationStatus() {
    return this.verification.status();
  }

  @Post("readiness/run")
  readinessRun() {
    return this.readiness.run();
  }

  @Get("readiness/status")
  readinessStatus() {
    return this.readiness.status();
  }

  @Post("certification/certify")
  certify(
    @Body()
    input: {
      approvedBy?: string;
    },
  ) {
    return this.certification.certify(
      input?.approvedBy,
    );
  }

  @Get("certification/status")
  certificationStatus() {
    return this.certification.status();
  }
}