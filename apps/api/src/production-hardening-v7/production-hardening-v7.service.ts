import { Injectable } from "@nestjs/common";
import { AssuranceReportService } from "./assurance-report.service";
import { ComplianceDriftService } from "./compliance-drift.service";
import { ContinuousAssuranceService } from "./continuous-assurance.service";
import { EnterpriseRiskService } from "./enterprise-risk.service";
import { IncidentReadinessService } from "./incident-readiness.service";
import { KeyLifecycleService } from "./key-lifecycle.service";
import { RemediationService } from "./remediation.service";
import { RetentionPolicyService } from "./retention-policy.service";

@Injectable()
export class ProductionHardeningV7Service {
  constructor(
    private readonly assurance: ContinuousAssuranceService,
    private readonly drift: ComplianceDriftService,
    private readonly risks: EnterpriseRiskService,
    private readonly readiness: IncidentReadinessService,
    private readonly keys: KeyLifecycleService,
    private readonly retention: RetentionPolicyService,
    private readonly remediation: RemediationService,
    private readonly reports: AssuranceReportService,
  ) {}

  async bootstrap(): Promise<Record<string, unknown>> {
    const controls =
      await this.assurance.seedDefaultControls();

    const risks =
      await this.risks.seedDefaults();

    const keys =
      await this.keys.seedDefaults();

    const retention =
      await this.retention.seedDefaults();

    return {
      success: true,
      system:
        "AVOS Production Hardening V7",
      version: "v7",
      initializedAt: new Date().toISOString(),
      controls,
      risks,
      keys,
      retention,
    };
  }

  async executeFullCycle(): Promise<Record<string, unknown>> {
    await this.bootstrap();

    const keyRotation =
      await this.keys.evaluateRotationDue();

    const assuranceRun =
      await this.assurance.runAssurance("api");

    const readiness =
      await this.readiness.assess();

    const report =
      await this.reports.generate(
        "continuous_assurance",
      );

    return {
      success: true,
      system:
        "AVOS Continuous Assurance Cycle",
      completedAt: new Date().toISOString(),
      keyRotation,
      assuranceRun,
      readiness,
      report,
    };
  }

  async status(): Promise<Record<string, unknown>> {
    const [
      controls,
      latestAssurance,
      drift,
      risk,
      readiness,
      keyRecords,
      retentionPolicies,
      remediation,
      reports,
    ] = await Promise.all([
      this.assurance.listControls(),
      this.assurance.getLatestRun(),
      this.drift.summary(),
      this.risks.summary(),
      this.readiness.latest(),
      this.keys.list(),
      this.retention.list(),
      this.remediation.summary(),
      this.reports.list(),
    ]);

    return {
      success: true,
      system:
        "AVOS Production Hardening V7",
      version: "v7",
      environment:
        process.env.NODE_ENV ?? "development",
      timestamp: new Date().toISOString(),
      capabilities: {
        continuousControlValidation: true,
        complianceDriftDetection: true,
        enterpriseRiskRegister: true,
        incidentReadiness: true,
        cryptographicKeyLifecycle: true,
        evidenceRetentionPolicies: true,
        remediationManagement: true,
        assuranceReporting: true,
        persistentStorage: true,
      },
      metrics: {
        controls: controls.length,
        latestAssuranceScore:
          latestAssurance?.score ?? null,
        latestAssuranceStatus:
          latestAssurance?.status ?? "not_run",
        drift,
        risk,
        readinessScore:
          readiness?.score ?? null,
        cryptographicKeyRecords:
          keyRecords.length,
        retentionPolicies:
          retentionPolicies.length,
        remediation,
        assuranceReports:
          reports.length,
      },
    };
  }
}
