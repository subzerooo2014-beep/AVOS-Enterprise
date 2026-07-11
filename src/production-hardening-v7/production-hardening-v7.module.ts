import { Module } from "@nestjs/common";
import { AssuranceReportService } from "./assurance-report.service";
import { AssuranceStorageService } from "./assurance-storage.service";
import { ComplianceDriftService } from "./compliance-drift.service";
import { ContinuousAssuranceService } from "./continuous-assurance.service";
import { EnterpriseRiskService } from "./enterprise-risk.service";
import { IncidentReadinessService } from "./incident-readiness.service";
import { KeyLifecycleService } from "./key-lifecycle.service";
import { ProductionHardeningV7Controller } from "./production-hardening-v7.controller";
import { ProductionHardeningV7Service } from "./production-hardening-v7.service";
import { RemediationService } from "./remediation.service";
import { RetentionPolicyService } from "./retention-policy.service";

@Module({
  controllers: [
    ProductionHardeningV7Controller,
  ],
  providers: [
    AssuranceStorageService,
    ContinuousAssuranceService,
    ComplianceDriftService,
    EnterpriseRiskService,
    IncidentReadinessService,
    KeyLifecycleService,
    RetentionPolicyService,
    RemediationService,
    AssuranceReportService,
    ProductionHardeningV7Service,
  ],
  exports: [
    AssuranceStorageService,
    ContinuousAssuranceService,
    ComplianceDriftService,
    EnterpriseRiskService,
    IncidentReadinessService,
    KeyLifecycleService,
    RetentionPolicyService,
    RemediationService,
    AssuranceReportService,
    ProductionHardeningV7Service,
  ],
})
export class ProductionHardeningV7Module {}
