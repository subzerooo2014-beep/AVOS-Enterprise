import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  AvosFactoryVerificationCheck,
  AvosFactoryVerificationReport
} from "./avos-factory-runtime.contracts";
import {
  AvosFactoryRuntimeService
} from "./avos-factory-runtime.service";
import {
  ProjectSmokeTestService
} from "./project-smoke-test.service";

@Injectable()
export class AvosFactoryVerificationService {
  private latestReport?: AvosFactoryVerificationReport;

  constructor(
    private readonly runtime:
      AvosFactoryRuntimeService,
    private readonly smoke:
      ProjectSmokeTestService
  ) {}

  async run(): Promise<AvosFactoryVerificationReport> {
    const status = this.runtime.status();
    const smokeResult = await this.smoke.run();

    const checks: AvosFactoryVerificationCheck[] = [
      {
        name: "runtimeHealthy",
        passed: status.status === "healthy"
      },
      {
        name: "foundationFirst",
        passed: status.foundationFirst === true
      },
      {
        name: "capabilityFirst",
        passed: status.capabilityFirst === true
      },
      {
        name: "blueprintDriven",
        passed: status.blueprintDriven === true
      },
      {
        name: "humanFinalAuthority",
        passed: status.humanFinalAuthority === true
      },
      {
        name: "blueprintEngine",
        passed: status.components.blueprintEngine
      },
      {
        name: "codeGenerationEngine",
        passed: status.components.codeGenerationEngine
      },
      {
        name: "templateEngine",
        passed: status.components.templateEngine
      },
      {
        name: "aiGenerator",
        passed: status.components.aiGenerator
      },
      {
        name: "projectGenerator",
        passed: status.components.projectGenerator
      },
      {
        name: "projectExecution",
        passed: status.components.projectExecution
      },
      {
        name: "filesystemTransaction",
        passed: status.components.filesystemTransaction
      },
      {
        name: "rollbackEngine",
        passed: status.components.rollbackEngine
      },
      {
        name: "projectManifest",
        passed: status.components.projectManifest
      },
      {
        name: "verificationEngine",
        passed: status.components.verificationEngine
      },
      {
        name: "registeredProjectKinds",
        passed: status.registeredProjectKinds >= 3,
        details: {
          count: status.registeredProjectKinds
        }
      },
      {
        name: "controlledSmokeTest",
        passed: smokeResult.success,
        details: {
          checks: smokeResult.checks,
          rollbackRestored:
            smokeResult.rollbackRestored,
          cleanupCompleted:
            smokeResult.cleanupCompleted,
          error:
            smokeResult.error
        }
      }
    ];

    const passedCount = checks.filter(
      (check) => check.passed
    ).length;

    const score = Math.round(
      (passedCount / checks.length) * 100
    );

    const blockingFindings = checks
      .filter((check) => !check.passed)
      .map((check) => check.name);

    const report: AvosFactoryVerificationReport = {
      id: randomUUID(),
      system: "AVOS Factory Core V1",
      version: "1.0.0",
      passed:
        blockingFindings.length === 0 &&
        score === 100,
      score,
      checks,
      blockingFindings,
      humanFinalAuthority: true,
      generatedAt:
        new Date().toISOString()
    };

    this.latestReport =
      structuredClone(report);

    return report;
  }

  latest(): AvosFactoryVerificationReport | undefined {
    return this.latestReport
      ? structuredClone(this.latestReport)
      : undefined;
  }
}
