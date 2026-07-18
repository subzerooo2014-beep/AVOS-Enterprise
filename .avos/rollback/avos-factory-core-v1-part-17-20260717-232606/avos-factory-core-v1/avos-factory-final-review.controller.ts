import {
  Body,
  Controller,
  Get,
  Post
} from "@nestjs/common";
import {
  AvosFactoryArchitectureReviewService
} from "./avos-factory-architecture-review.service";
import {
  AvosFactoryE2EService
} from "./avos-factory-e2e.service";
import {
  AvosFactoryFinalCertificationService
} from "./avos-factory-final-certification.service";
import {
  AvosFactoryReleaseReadinessService
} from "./avos-factory-release-readiness.service";

@Controller("avos/factory/v1/final-review")
export class AvosFactoryFinalReviewController {
  constructor(
    private readonly architecture:
      AvosFactoryArchitectureReviewService,
    private readonly e2e:
      AvosFactoryE2EService,
    private readonly readiness:
      AvosFactoryReleaseReadinessService,
    private readonly certification:
      AvosFactoryFinalCertificationService
  ) {}

  @Post("architecture/run")
  architectureRun() {
    return this.architecture.run();
  }

  @Post("e2e/run")
  e2eRun() {
    return this.e2e.run();
  }

  @Post("readiness/run")
  readinessRun() {
    return this.readiness.evaluate();
  }

  @Get("readiness/latest")
  readinessLatest() {
    return {
      report:
        this.readiness.latest() ?? null
    };
  }

  @Post("certification/certify")
  certificationRun(
    @Body() input: {
      approvedBy: string;
      humanApproved: boolean;
    }
  ) {
    return this.certification.certify(
      input
    );
  }

  @Get("certification/latest")
  certificationLatest() {
    return {
      certification:
        this.certification.latest() ?? null
    };
  }
}
