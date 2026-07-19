import { Controller, Get, Post } from "@nestjs/common";
import { OmegaCertificationCenterService } from "./certification/omega-certification-center.service";
import { OmegaDashboardService } from "./dashboard/omega-dashboard.service";
import { OmegaPolicyEngineService } from "./engines/omega-policy-engine.service";
import { OmegaRuleEngineService } from "./engines/omega-rule-engine.service";
import { OmegaHistoryService } from "./history/omega-history.service";
import { OmegaTrendEngineService } from "./history/omega-trend-engine.service";
import { OmegaOrchestratorService } from "./omega-orchestrator.service";
import { OmegaExecutiveReportService } from "./reports/omega-executive-report.service";
import { ArchitectureIntelligenceService } from "./advanced/architecture-intelligence.service";
import { ApiInspectionEngineService } from "./advanced/api-inspection-engine.service";
import { ConfigurationInspectionEngineService } from "./advanced/configuration-inspection-engine.service";
import { DatabaseInspectionEngineService } from "./advanced/database-inspection-engine.service";
import { SecurityBaselineEngineService } from "./advanced/security-baseline-engine.service";

@Controller("inspection-certification/omega")
export class OmegaController {
  constructor(
    private readonly orchestrator: OmegaOrchestratorService,
    private readonly dashboard: OmegaDashboardService,
    private readonly history: OmegaHistoryService,
    private readonly trends: OmegaTrendEngineService,
    private readonly rules: OmegaRuleEngineService,
    private readonly policies: OmegaPolicyEngineService,
    private readonly certificates: OmegaCertificationCenterService,
    private readonly executiveReports: OmegaExecutiveReportService,
    private readonly architecture: ArchitectureIntelligenceService,
    private readonly apiInspection: ApiInspectionEngineService,
    private readonly configuration: ConfigurationInspectionEngineService,
    private readonly database: DatabaseInspectionEngineService,
    private readonly security: SecurityBaselineEngineService,
  ) {}

  @Get("status")
  status() {
    return {
      system: "AVOS Inspection & Certification OS",
      pack: "Mega Pack Omega-1 Part 1",
      version: "2.0.0-omega.1",
      status: "healthy",
      engines: 18,
      humanFinalAuthority: true,
      nonDestructive: true,
      next: "Omega-1 Part 2",
    };
  }

  @Get("rules")
  rulesList() {
    return {
      count: this.rules.list().length,
      rules: this.rules.list(),
    };
  }

  @Get("policies")
  policiesList() {
    return {
      count: this.policies.list().length,
      policies: this.policies.list(),
    };
  }

  @Get("dashboard")
  dashboardSnapshot() {
    return this.dashboard.snapshot();
  }

  @Get("history")
  historyList() {
    return {
      count: this.history.count(),
      assessments: this.history.list(),
    };
  }

  @Get("trends")
  trendAnalysis() {
    return this.trends.analyze(this.history.list(100));
  }

  @Get("certificates")
  certificateList() {
    return {
      count: this.certificates.list().length,
      certificates: this.certificates.list(),
    };
  }

  @Get("capabilities")
  capabilities() {
    return {
      architecture: this.architecture.analyze(),
      api: this.apiInspection.inspect(),
      configuration: this.configuration.inspect(),
      database: this.database.inspect(),
      security: this.security.inspect(),
    };
  }

  @Post("assess")
  async assess() {
    return this.orchestrator.assess();
  }

  @Post("assess-and-certify")
  async assessAndCertify() {
    const result = await this.orchestrator.assess();
    const certificate = this.certificates.issue(
      result.assessment,
      result.readiness.level,
    );

    return {
      ...result,
      certificate,
      executiveReport: this.executiveReports.create(result.assessment),
    };
  }
}
