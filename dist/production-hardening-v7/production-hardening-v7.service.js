"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductionHardeningV7Service = void 0;
const common_1 = require("@nestjs/common");
const assurance_report_service_1 = require("./assurance-report.service");
const compliance_drift_service_1 = require("./compliance-drift.service");
const continuous_assurance_service_1 = require("./continuous-assurance.service");
const enterprise_risk_service_1 = require("./enterprise-risk.service");
const incident_readiness_service_1 = require("./incident-readiness.service");
const key_lifecycle_service_1 = require("./key-lifecycle.service");
const remediation_service_1 = require("./remediation.service");
const retention_policy_service_1 = require("./retention-policy.service");
let ProductionHardeningV7Service = class ProductionHardeningV7Service {
    constructor(assurance, drift, risks, readiness, keys, retention, remediation, reports) {
        this.assurance = assurance;
        this.drift = drift;
        this.risks = risks;
        this.readiness = readiness;
        this.keys = keys;
        this.retention = retention;
        this.remediation = remediation;
        this.reports = reports;
    }
    async bootstrap() {
        const controls = await this.assurance.seedDefaultControls();
        const risks = await this.risks.seedDefaults();
        const keys = await this.keys.seedDefaults();
        const retention = await this.retention.seedDefaults();
        return {
            success: true,
            system: "AVOS Production Hardening V7",
            version: "v7",
            initializedAt: new Date().toISOString(),
            controls,
            risks,
            keys,
            retention,
        };
    }
    async executeFullCycle() {
        await this.bootstrap();
        const keyRotation = await this.keys.evaluateRotationDue();
        const assuranceRun = await this.assurance.runAssurance("api");
        const readiness = await this.readiness.assess();
        const report = await this.reports.generate("continuous_assurance");
        return {
            success: true,
            system: "AVOS Continuous Assurance Cycle",
            completedAt: new Date().toISOString(),
            keyRotation,
            assuranceRun,
            readiness,
            report,
        };
    }
    async status() {
        const [controls, latestAssurance, drift, risk, readiness, keyRecords, retentionPolicies, remediation, reports,] = await Promise.all([
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
            system: "AVOS Production Hardening V7",
            version: "v7",
            environment: process.env.NODE_ENV ?? "development",
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
                latestAssuranceScore: latestAssurance?.score ?? null,
                latestAssuranceStatus: latestAssurance?.status ?? "not_run",
                drift,
                risk,
                readinessScore: readiness?.score ?? null,
                cryptographicKeyRecords: keyRecords.length,
                retentionPolicies: retentionPolicies.length,
                remediation,
                assuranceReports: reports.length,
            },
        };
    }
};
exports.ProductionHardeningV7Service = ProductionHardeningV7Service;
exports.ProductionHardeningV7Service = ProductionHardeningV7Service = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [continuous_assurance_service_1.ContinuousAssuranceService,
        compliance_drift_service_1.ComplianceDriftService,
        enterprise_risk_service_1.EnterpriseRiskService,
        incident_readiness_service_1.IncidentReadinessService,
        key_lifecycle_service_1.KeyLifecycleService,
        retention_policy_service_1.RetentionPolicyService,
        remediation_service_1.RemediationService,
        assurance_report_service_1.AssuranceReportService])
], ProductionHardeningV7Service);
//# sourceMappingURL=production-hardening-v7.service.js.map