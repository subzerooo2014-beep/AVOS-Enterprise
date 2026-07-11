import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { AssuranceReportService } from "./assurance-report.service";
import { ComplianceDriftService } from "./compliance-drift.service";
import { ContinuousAssuranceService } from "./continuous-assurance.service";
import { CreateControlDto } from "./dto/create-control.dto";
import { CreateDriftEventDto } from "./dto/create-drift-event.dto";
import { CreateKeyRecordDto } from "./dto/create-key-record.dto";
import { CreateRemediationDto } from "./dto/create-remediation.dto";
import { CreateRetentionPolicyDto } from "./dto/create-retention-policy.dto";
import { CreateRiskDto } from "./dto/create-risk.dto";
import { RunAssuranceDto } from "./dto/run-assurance.dto";
import {
  UpdateDriftStatusDto,
  UpdateRemediationStatusDto,
  UpdateRiskStatusDto,
} from "./dto/update-status.dto";
import { EnterpriseRiskService } from "./enterprise-risk.service";
import { IncidentReadinessService } from "./incident-readiness.service";
import { KeyLifecycleService } from "./key-lifecycle.service";
import { ProductionHardeningV7Service } from "./production-hardening-v7.service";
import { RemediationService } from "./remediation.service";
import { RetentionPolicyService } from "./retention-policy.service";
import {
  AssuranceReport,
  KeyLifecycleStatus,
  RemediationStatus,
  RiskStatus,
} from "./types/production-hardening-v7.types";

@Controller("production-hardening-v7")
export class ProductionHardeningV7Controller {
  constructor(
    private readonly platform:
      ProductionHardeningV7Service,
    private readonly assurance:
      ContinuousAssuranceService,
    private readonly drift:
      ComplianceDriftService,
    private readonly risks:
      EnterpriseRiskService,
    private readonly readiness:
      IncidentReadinessService,
    private readonly keys:
      KeyLifecycleService,
    private readonly retention:
      RetentionPolicyService,
    private readonly remediation:
      RemediationService,
    private readonly reports:
      AssuranceReportService,
  ) {}

  @Get("status")
  status() {
    return this.platform.status();
  }

  @Post("bootstrap")
  bootstrap() {
    return this.platform.bootstrap();
  }

  @Post("cycle/run")
  runFullCycle() {
    return this.platform.executeFullCycle();
  }

  @Post("controls")
  createControl(
    @Body() dto: CreateControlDto,
  ) {
    return this.assurance.createControl(dto);
  }

  @Get("controls")
  listControls() {
    return this.assurance.listControls();
  }

  @Post("assurance/run")
  runAssurance(
    @Body() dto: RunAssuranceDto,
  ) {
    return this.assurance.runAssurance(
      dto.trigger ?? "manual",
    );
  }

  @Get("assurance/runs")
  listAssuranceRuns() {
    return this.assurance.listRuns();
  }

  @Get("assurance/latest")
  latestAssuranceRun() {
    return this.assurance.getLatestRun();
  }

  @Post("drift")
  detectDrift(
    @Body() dto: CreateDriftEventDto,
  ) {
    return this.drift.detect(dto);
  }

  @Get("drift")
  listDrift(
    @Query("status")
    status?:
      | "open"
      | "acknowledged"
      | "resolved"
      | "ignored",
  ) {
    return this.drift.list(status);
  }

  @Patch("drift/:id/status")
  updateDriftStatus(
    @Param("id") id: string,
    @Body() dto: UpdateDriftStatusDto,
  ) {
    return this.drift.updateStatus(
      id,
      dto.status,
    );
  }

  @Post("risks")
  createRisk(@Body() dto: CreateRiskDto) {
    return this.risks.create(dto);
  }

  @Get("risks")
  listRisks(
    @Query("status") status?: RiskStatus,
  ) {
    return this.risks.list(status);
  }

  @Patch("risks/:id/status")
  updateRiskStatus(
    @Param("id") id: string,
    @Body() dto: UpdateRiskStatusDto,
  ) {
    return this.risks.updateStatus(
      id,
      dto.status,
    );
  }

  @Post("incident-readiness/assess")
  assessIncidentReadiness() {
    return this.readiness.assess();
  }

  @Get("incident-readiness/latest")
  latestIncidentReadiness() {
    return this.readiness.latest();
  }

  @Post("keys")
  registerKey(
    @Body() dto: CreateKeyRecordDto,
  ) {
    return this.keys.register(dto);
  }

  @Get("keys")
  listKeys() {
    return this.keys.list();
  }

  @Patch("keys/:id/status/:status")
  updateKeyStatus(
    @Param("id") id: string,
    @Param("status")
    status: KeyLifecycleStatus,
  ) {
    return this.keys.updateStatus(id, status);
  }

  @Post("keys/evaluate-rotation")
  evaluateKeyRotation() {
    return this.keys.evaluateRotationDue();
  }

  @Post("retention-policies")
  createRetentionPolicy(
    @Body() dto: CreateRetentionPolicyDto,
  ) {
    return this.retention.create(dto);
  }

  @Get("retention-policies")
  listRetentionPolicies() {
    return this.retention.list();
  }

  @Post("remediations")
  createRemediation(
    @Body() dto: CreateRemediationDto,
  ) {
    return this.remediation.create(dto);
  }

  @Get("remediations")
  listRemediations(
    @Query("status")
    status?: RemediationStatus,
  ) {
    return this.remediation.list(status);
  }

  @Patch("remediations/:id/status")
  updateRemediationStatus(
    @Param("id") id: string,
    @Body() dto: UpdateRemediationStatusDto,
  ) {
    return this.remediation.updateStatus(
      id,
      dto.status,
    );
  }

  @Post(
    "remediations/:planId/actions/:actionId/complete",
  )
  completeRemediationAction(
    @Param("planId") planId: string,
    @Param("actionId") actionId: string,
  ) {
    return this.remediation.completeAction(
      planId,
      actionId,
    );
  }

  @Post("reports/generate")
  generateReport(
    @Query("type")
    reportType?:
      AssuranceReport["reportType"],
  ) {
    return this.reports.generate(
      reportType ?? "continuous_assurance",
    );
  }

  @Get("reports")
  listReports() {
    return this.reports.list();
  }
}
