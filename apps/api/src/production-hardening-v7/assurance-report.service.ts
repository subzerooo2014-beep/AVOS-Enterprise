import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { AssuranceStorageService } from "./assurance-storage.service";
import { ContinuousAssuranceService } from "./continuous-assurance.service";
import { ComplianceDriftService } from "./compliance-drift.service";
import { EnterpriseRiskService } from "./enterprise-risk.service";
import { IncidentReadinessService } from "./incident-readiness.service";
import { RemediationService } from "./remediation.service";
import {
  AssuranceReport,
  AssuranceStatus,
} from "./types/production-hardening-v7.types";

@Injectable()
export class AssuranceReportService {
  private readonly collection = "assurance-reports";

  constructor(
    private readonly storage: AssuranceStorageService,
    private readonly assurance: ContinuousAssuranceService,
    private readonly drift: ComplianceDriftService,
    private readonly risks: EnterpriseRiskService,
    private readonly readiness: IncidentReadinessService,
    private readonly remediation: RemediationService,
  ) {}

  async generate(
    reportType: AssuranceReport["reportType"] =
      "continuous_assurance",
  ): Promise<AssuranceReport> {
    let latestAssurance =
      await this.assurance.getLatestRun();

    if (!latestAssurance) {
      latestAssurance =
        await this.assurance.runAssurance(
          "scheduled",
        );
    }

    let latestReadiness =
      await this.readiness.latest();

    if (!latestReadiness) {
      latestReadiness =
        await this.readiness.assess();
    }

    const driftSummary = await this.drift.summary();
    const riskSummary = await this.risks.summary();
    const remediationSummary =
      await this.remediation.summary();

    const overallStatus =
      this.calculateOverallStatus({
        assuranceStatus: latestAssurance.status,
        criticalDrift: driftSummary.criticalOpen,
        criticalRisks: riskSummary.critical,
        criticalRemediations:
          remediationSummary.criticalOpen,
        readinessScore: latestReadiness.score,
      });

    const recommendations: string[] = [];

    if (latestAssurance.failedControls > 0) {
      recommendations.push(
        "Create remediation plans for every failed assurance control.",
      );
    }

    if (driftSummary.open > 0) {
      recommendations.push(
        "Review and resolve open compliance drift events.",
      );
    }

    if (
      riskSummary.normalizedRiskScore >= 40
    ) {
      recommendations.push(
        "Reduce aggregate residual enterprise risk.",
      );
    }

    if (latestReadiness.score < 90) {
      recommendations.push(
        "Complete incident readiness capability gaps.",
      );
    }

    if (recommendations.length === 0) {
      recommendations.push(
        "Maintain continuous assurance runs and evidence retention.",
      );
    }

    const now = new Date().toISOString();

    const report: AssuranceReport = {
      id: randomUUID(),
      reportType,
      generatedAt: now,
      overallStatus,
      assuranceScore: latestAssurance.score,
      riskScore: riskSummary.normalizedRiskScore,
      readinessScore: latestReadiness.score,
      openDriftEvents: driftSummary.open,
      openRemediations:
        remediationSummary.open +
        remediationSummary.inProgress +
        remediationSummary.blocked,
      summary: {
        latestAssurance,
        drift: driftSummary,
        risk: riskSummary,
        incidentReadiness: latestReadiness,
        remediation: remediationSummary,
      },
      recommendations,
      createdAt: now,
      updatedAt: now,
    };

    await this.storage.append(
      this.collection,
      report,
    );

    return report;
  }

  async list(): Promise<AssuranceReport[]> {
    const reports =
      await this.storage.readCollection<AssuranceReport>(
        this.collection,
      );

    return reports.sort((a, b) =>
      b.generatedAt.localeCompare(a.generatedAt),
    );
  }

  private calculateOverallStatus(input: {
    assuranceStatus: AssuranceStatus;
    criticalDrift: number;
    criticalRisks: number;
    criticalRemediations: number;
    readinessScore: number;
  }): AssuranceStatus {
    if (
      input.assuranceStatus === "critical" ||
      input.criticalDrift > 0 ||
      input.criticalRisks > 0 ||
      input.criticalRemediations > 0
    ) {
      return "critical";
    }

    if (
      input.assuranceStatus === "degraded" ||
      input.readinessScore < 60
    ) {
      return "degraded";
    }

    if (
      input.assuranceStatus === "warning" ||
      input.readinessScore < 90
    ) {
      return "warning";
    }

    return "healthy";
  }
}
