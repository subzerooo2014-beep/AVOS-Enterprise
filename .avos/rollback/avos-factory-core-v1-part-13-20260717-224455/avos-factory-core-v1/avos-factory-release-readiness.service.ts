import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  AvosFactoryReleaseReadinessReport
} from "./avos-factory-final-review.contracts";
import {
  AvosFactoryArchitectureReviewService
} from "./avos-factory-architecture-review.service";
import {
  AvosFactoryCertificationService
} from "./avos-factory-certification.service";
import {
  AvosFactoryE2EService
} from "./avos-factory-e2e.service";
import {
  AvosFactoryReadinessService
} from "./avos-factory-readiness.service";
import {
  AvosFactoryVerificationService
} from "./avos-factory-verification.service";

@Injectable()
export class AvosFactoryReleaseReadinessService {
  private latestReport?:
    AvosFactoryReleaseReadinessReport;

  constructor(
    private readonly architecture:
      AvosFactoryArchitectureReviewService,
    private readonly e2e:
      AvosFactoryE2EService,
    private readonly operations:
      AvosFactoryReadinessService,
    private readonly verification:
      AvosFactoryVerificationService,
    private readonly certification:
      AvosFactoryCertificationService
  ) {}

  async evaluate(): Promise<AvosFactoryReleaseReadinessReport> {
    const architecture =
      this.architecture.run();

    const e2e =
      await this.e2e.run();

    const operations =
      this.operations.evaluate();

    const verification =
      this.verification.latest() ??
      await this.verification.run();

    const certification =
      this.certification.latest();

    const checks = {
      architectureReviewPassed:
        architecture.passed,
      e2ePassed:
        e2e.passed,
      operationalReadinessPassed:
        operations.ready &&
        operations.score === 100,
      verificationPassed:
        verification.passed &&
        verification.score === 100,
      certificationPassed:
        certification?.status === "certified"
    };

    const blockingFindings =
      Object.entries(checks)
        .filter(([, passed]) => !passed)
        .map(([name]) => name);

    const score = Math.round(
      (
        Object.values(checks)
          .filter(Boolean)
          .length /
        Object.keys(checks).length
      ) * 100
    );

    const report: AvosFactoryReleaseReadinessReport = {
      id: randomUUID(),
      system: "AVOS Factory Core V1",
      version: "1.0.0",
      ready:
        score === 100 &&
        blockingFindings.length === 0,
      score,
      architectureReviewPassed:
        checks.architectureReviewPassed,
      e2ePassed:
        checks.e2ePassed,
      operationalReadinessPassed:
        checks.operationalReadinessPassed,
      verificationPassed:
        checks.verificationPassed,
      certificationPassed:
        checks.certificationPassed,
      humanFinalAuthority: true,
      blockingFindings,
      generatedAt:
        new Date().toISOString()
    };

    this.latestReport =
      structuredClone(report);

    return report;
  }

  latest():
    | AvosFactoryReleaseReadinessReport
    | undefined {
    return this.latestReport
      ? structuredClone(this.latestReport)
      : undefined;
  }
}
