import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  AvosFactoryE2EReport
} from "./avos-factory-final-review.contracts";
import {
  AvosFactoryArchitectureReviewService
} from "./avos-factory-architecture-review.service";
import {
  AvosFactoryAuditService
} from "./avos-factory-audit.service";
import {
  AvosFactoryEnforcementSmokeService
} from "./avos-factory-enforcement-smoke.service";
import {
  AvosFactoryHealthService
} from "./avos-factory-health.service";
import {
  AvosFactoryReadinessService
} from "./avos-factory-readiness.service";
import {
  AvosFactoryRuntimeService
} from "./avos-factory-runtime.service";
import {
  AvosFactoryVerificationService
} from "./avos-factory-verification.service";

@Injectable()
export class AvosFactoryE2EService {
  constructor(
    private readonly runtime:
      AvosFactoryRuntimeService,
    private readonly architecture:
      AvosFactoryArchitectureReviewService,
    private readonly health:
      AvosFactoryHealthService,
    private readonly readiness:
      AvosFactoryReadinessService,
    private readonly enforcementSmoke:
      AvosFactoryEnforcementSmokeService,
    private readonly verification:
      AvosFactoryVerificationService,
    private readonly audit:
      AvosFactoryAuditService
  ) {}

  async run(): Promise<AvosFactoryE2EReport> {
    const runtime =
      this.runtime.status();

    const architecture =
      this.architecture.run();

    const health =
      this.health.calculate();

    const readiness =
      this.readiness.evaluate();

    const smoke =
      await this.enforcementSmoke.run();

    const verification =
      await this.verification.run();

    const checks = [
      {
        name: "runtimeHealthy",
        passed:
          runtime.status === "healthy"
      },
      {
        name: "architectureReview",
        passed:
          architecture.passed,
        details: {
          score:
            architecture.score,
          blockingFindings:
            architecture.blockingFindings
        }
      },
      {
        name: "healthScore",
        passed:
          health.score === 100
      },
      {
        name: "operationalReadiness",
        passed:
          readiness.ready &&
          readiness.score === 100
      },
      {
        name: "enforcementSmoke",
        passed:
          smoke.success,
        details: {
          checks:
            smoke.checks,
          error:
            smoke.error
        }
      },
      {
        name: "verification",
        passed:
          verification.passed &&
          verification.score === 100
      },
      {
        name: "auditIntegration",
        passed:
          this.audit.count() > 0,
        details: {
          auditEvents:
            this.audit.count()
        }
      },
      {
        name: "humanFinalAuthority",
        passed:
          runtime.humanFinalAuthority &&
          readiness.humanFinalAuthority &&
          architecture.humanFinalAuthority
      }
    ];

    const passedCount =
      checks.filter(
        (check) => check.passed
      ).length;

    const score = Math.round(
      (
        passedCount /
        checks.length
      ) * 100
    );

    return {
      id: randomUUID(),
      system: "AVOS Factory Core V1",
      passed:
        score === 100 &&
        checks.every(
          (check) => check.passed
        ),
      score,
      checks,
      generatedAt:
        new Date().toISOString()
    };
  }
}
