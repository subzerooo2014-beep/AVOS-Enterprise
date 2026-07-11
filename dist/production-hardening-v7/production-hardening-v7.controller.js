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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductionHardeningV7Controller = void 0;
const common_1 = require("@nestjs/common");
const assurance_report_service_1 = require("./assurance-report.service");
const compliance_drift_service_1 = require("./compliance-drift.service");
const continuous_assurance_service_1 = require("./continuous-assurance.service");
const create_control_dto_1 = require("./dto/create-control.dto");
const create_drift_event_dto_1 = require("./dto/create-drift-event.dto");
const create_key_record_dto_1 = require("./dto/create-key-record.dto");
const create_remediation_dto_1 = require("./dto/create-remediation.dto");
const create_retention_policy_dto_1 = require("./dto/create-retention-policy.dto");
const create_risk_dto_1 = require("./dto/create-risk.dto");
const run_assurance_dto_1 = require("./dto/run-assurance.dto");
const update_status_dto_1 = require("./dto/update-status.dto");
const enterprise_risk_service_1 = require("./enterprise-risk.service");
const incident_readiness_service_1 = require("./incident-readiness.service");
const key_lifecycle_service_1 = require("./key-lifecycle.service");
const production_hardening_v7_service_1 = require("./production-hardening-v7.service");
const remediation_service_1 = require("./remediation.service");
const retention_policy_service_1 = require("./retention-policy.service");
let ProductionHardeningV7Controller = class ProductionHardeningV7Controller {
    constructor(platform, assurance, drift, risks, readiness, keys, retention, remediation, reports) {
        this.platform = platform;
        this.assurance = assurance;
        this.drift = drift;
        this.risks = risks;
        this.readiness = readiness;
        this.keys = keys;
        this.retention = retention;
        this.remediation = remediation;
        this.reports = reports;
    }
    status() {
        return this.platform.status();
    }
    bootstrap() {
        return this.platform.bootstrap();
    }
    runFullCycle() {
        return this.platform.executeFullCycle();
    }
    createControl(dto) {
        return this.assurance.createControl(dto);
    }
    listControls() {
        return this.assurance.listControls();
    }
    runAssurance(dto) {
        return this.assurance.runAssurance(dto.trigger ?? "manual");
    }
    listAssuranceRuns() {
        return this.assurance.listRuns();
    }
    latestAssuranceRun() {
        return this.assurance.getLatestRun();
    }
    detectDrift(dto) {
        return this.drift.detect(dto);
    }
    listDrift(status) {
        return this.drift.list(status);
    }
    updateDriftStatus(id, dto) {
        return this.drift.updateStatus(id, dto.status);
    }
    createRisk(dto) {
        return this.risks.create(dto);
    }
    listRisks(status) {
        return this.risks.list(status);
    }
    updateRiskStatus(id, dto) {
        return this.risks.updateStatus(id, dto.status);
    }
    assessIncidentReadiness() {
        return this.readiness.assess();
    }
    latestIncidentReadiness() {
        return this.readiness.latest();
    }
    registerKey(dto) {
        return this.keys.register(dto);
    }
    listKeys() {
        return this.keys.list();
    }
    updateKeyStatus(id, status) {
        return this.keys.updateStatus(id, status);
    }
    evaluateKeyRotation() {
        return this.keys.evaluateRotationDue();
    }
    createRetentionPolicy(dto) {
        return this.retention.create(dto);
    }
    listRetentionPolicies() {
        return this.retention.list();
    }
    createRemediation(dto) {
        return this.remediation.create(dto);
    }
    listRemediations(status) {
        return this.remediation.list(status);
    }
    updateRemediationStatus(id, dto) {
        return this.remediation.updateStatus(id, dto.status);
    }
    completeRemediationAction(planId, actionId) {
        return this.remediation.completeAction(planId, actionId);
    }
    generateReport(reportType) {
        return this.reports.generate(reportType ?? "continuous_assurance");
    }
    listReports() {
        return this.reports.list();
    }
};
exports.ProductionHardeningV7Controller = ProductionHardeningV7Controller;
__decorate([
    (0, common_1.Get)("status"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7Controller.prototype, "status", null);
__decorate([
    (0, common_1.Post)("bootstrap"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7Controller.prototype, "bootstrap", null);
__decorate([
    (0, common_1.Post)("cycle/run"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7Controller.prototype, "runFullCycle", null);
__decorate([
    (0, common_1.Post)("controls"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_control_dto_1.CreateControlDto]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7Controller.prototype, "createControl", null);
__decorate([
    (0, common_1.Get)("controls"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7Controller.prototype, "listControls", null);
__decorate([
    (0, common_1.Post)("assurance/run"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [run_assurance_dto_1.RunAssuranceDto]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7Controller.prototype, "runAssurance", null);
__decorate([
    (0, common_1.Get)("assurance/runs"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7Controller.prototype, "listAssuranceRuns", null);
__decorate([
    (0, common_1.Get)("assurance/latest"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7Controller.prototype, "latestAssuranceRun", null);
__decorate([
    (0, common_1.Post)("drift"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_drift_event_dto_1.CreateDriftEventDto]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7Controller.prototype, "detectDrift", null);
__decorate([
    (0, common_1.Get)("drift"),
    __param(0, (0, common_1.Query)("status")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7Controller.prototype, "listDrift", null);
__decorate([
    (0, common_1.Patch)("drift/:id/status"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_status_dto_1.UpdateDriftStatusDto]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7Controller.prototype, "updateDriftStatus", null);
__decorate([
    (0, common_1.Post)("risks"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_risk_dto_1.CreateRiskDto]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7Controller.prototype, "createRisk", null);
__decorate([
    (0, common_1.Get)("risks"),
    __param(0, (0, common_1.Query)("status")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7Controller.prototype, "listRisks", null);
__decorate([
    (0, common_1.Patch)("risks/:id/status"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_status_dto_1.UpdateRiskStatusDto]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7Controller.prototype, "updateRiskStatus", null);
__decorate([
    (0, common_1.Post)("incident-readiness/assess"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7Controller.prototype, "assessIncidentReadiness", null);
__decorate([
    (0, common_1.Get)("incident-readiness/latest"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7Controller.prototype, "latestIncidentReadiness", null);
__decorate([
    (0, common_1.Post)("keys"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_key_record_dto_1.CreateKeyRecordDto]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7Controller.prototype, "registerKey", null);
__decorate([
    (0, common_1.Get)("keys"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7Controller.prototype, "listKeys", null);
__decorate([
    (0, common_1.Patch)("keys/:id/status/:status"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Param)("status")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7Controller.prototype, "updateKeyStatus", null);
__decorate([
    (0, common_1.Post)("keys/evaluate-rotation"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7Controller.prototype, "evaluateKeyRotation", null);
__decorate([
    (0, common_1.Post)("retention-policies"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_retention_policy_dto_1.CreateRetentionPolicyDto]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7Controller.prototype, "createRetentionPolicy", null);
__decorate([
    (0, common_1.Get)("retention-policies"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7Controller.prototype, "listRetentionPolicies", null);
__decorate([
    (0, common_1.Post)("remediations"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_remediation_dto_1.CreateRemediationDto]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7Controller.prototype, "createRemediation", null);
__decorate([
    (0, common_1.Get)("remediations"),
    __param(0, (0, common_1.Query)("status")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7Controller.prototype, "listRemediations", null);
__decorate([
    (0, common_1.Patch)("remediations/:id/status"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_status_dto_1.UpdateRemediationStatusDto]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7Controller.prototype, "updateRemediationStatus", null);
__decorate([
    (0, common_1.Post)("remediations/:planId/actions/:actionId/complete"),
    __param(0, (0, common_1.Param)("planId")),
    __param(1, (0, common_1.Param)("actionId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7Controller.prototype, "completeRemediationAction", null);
__decorate([
    (0, common_1.Post)("reports/generate"),
    __param(0, (0, common_1.Query)("type")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7Controller.prototype, "generateReport", null);
__decorate([
    (0, common_1.Get)("reports"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7Controller.prototype, "listReports", null);
exports.ProductionHardeningV7Controller = ProductionHardeningV7Controller = __decorate([
    (0, common_1.Controller)("production-hardening-v7"),
    __metadata("design:paramtypes", [production_hardening_v7_service_1.ProductionHardeningV7Service,
        continuous_assurance_service_1.ContinuousAssuranceService,
        compliance_drift_service_1.ComplianceDriftService,
        enterprise_risk_service_1.EnterpriseRiskService,
        incident_readiness_service_1.IncidentReadinessService,
        key_lifecycle_service_1.KeyLifecycleService,
        retention_policy_service_1.RetentionPolicyService,
        remediation_service_1.RemediationService,
        assurance_report_service_1.AssuranceReportService])
], ProductionHardeningV7Controller);
//# sourceMappingURL=production-hardening-v7.controller.js.map