import { Injectable } from "@nestjs/common";
import {
  AutonomousFactoryRun,
  ProductionCertification,
} from "../contracts/autonomous-factory.contracts";
import { createFactoryId } from "../utils/factory-id.util";

@Injectable()
export class FactoryProductionCertificationService {
  certify(
    run: AutonomousFactoryRun,
    approved: boolean,
    approvedBy?: string,
    metadata: Record<string, unknown> = {},
  ): ProductionCertification {
    if (!run.blueprint || !run.dependencyResolution) {
      throw new Error("Run is incomplete and cannot be certified.");
    }

    const minimumQuality = run.blueprint.qualityThreshold;
    const averageQuality = run.qualityReports.length
      ? Math.round(
          run.qualityReports.reduce(
            (sum, report) => sum + report.score,
            0,
          ) / run.qualityReports.length,
        )
      : 0;

    const reasons: string[] = [];

    if (!run.dependencyResolution.valid) {
      reasons.push("Dependency resolution failed.");
    }

    if (
      run.qualityReports.some(
        (report) => !report.passed || report.score < minimumQuality,
      )
    ) {
      reasons.push(
        `One or more quality reports are below threshold ${minimumQuality}.`,
      );
    }

    if (!approved) {
      reasons.push("Human approval was not granted.");
    }

    const status =
      reasons.length === 0 ? "certified" : "rejected";

    return {
      id: createFactoryId("factory-production-certification"),
      runId: run.id,
      blueprintId: run.blueprint.id,
      packageIds: [...run.packageIds],
      status,
      score: averageQuality,
      qualityThreshold: minimumQuality,
      humanFinalAuthority: true,
      requiresHumanApproval: true,
      reasons,
      certifiedAt: new Date().toISOString(),
      metadata: {
        ...metadata,
        approvedBy: approvedBy ?? "unknown",
        approved,
      },
    };
  }
}
