"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductionHardeningV7Module = void 0;
const common_1 = require("@nestjs/common");
const assurance_report_service_1 = require("./assurance-report.service");
const assurance_storage_service_1 = require("./assurance-storage.service");
const compliance_drift_service_1 = require("./compliance-drift.service");
const continuous_assurance_service_1 = require("./continuous-assurance.service");
const enterprise_risk_service_1 = require("./enterprise-risk.service");
const incident_readiness_service_1 = require("./incident-readiness.service");
const key_lifecycle_service_1 = require("./key-lifecycle.service");
const production_hardening_v7_controller_1 = require("./production-hardening-v7.controller");
const production_hardening_v7_service_1 = require("./production-hardening-v7.service");
const remediation_service_1 = require("./remediation.service");
const retention_policy_service_1 = require("./retention-policy.service");
let ProductionHardeningV7Module = class ProductionHardeningV7Module {
};
exports.ProductionHardeningV7Module = ProductionHardeningV7Module;
exports.ProductionHardeningV7Module = ProductionHardeningV7Module = __decorate([
    (0, common_1.Module)({
        controllers: [
            production_hardening_v7_controller_1.ProductionHardeningV7Controller,
        ],
        providers: [
            assurance_storage_service_1.AssuranceStorageService,
            continuous_assurance_service_1.ContinuousAssuranceService,
            compliance_drift_service_1.ComplianceDriftService,
            enterprise_risk_service_1.EnterpriseRiskService,
            incident_readiness_service_1.IncidentReadinessService,
            key_lifecycle_service_1.KeyLifecycleService,
            retention_policy_service_1.RetentionPolicyService,
            remediation_service_1.RemediationService,
            assurance_report_service_1.AssuranceReportService,
            production_hardening_v7_service_1.ProductionHardeningV7Service,
        ],
        exports: [
            assurance_storage_service_1.AssuranceStorageService,
            continuous_assurance_service_1.ContinuousAssuranceService,
            compliance_drift_service_1.ComplianceDriftService,
            enterprise_risk_service_1.EnterpriseRiskService,
            incident_readiness_service_1.IncidentReadinessService,
            key_lifecycle_service_1.KeyLifecycleService,
            retention_policy_service_1.RetentionPolicyService,
            remediation_service_1.RemediationService,
            assurance_report_service_1.AssuranceReportService,
            production_hardening_v7_service_1.ProductionHardeningV7Service,
        ],
    })
], ProductionHardeningV7Module);
//# sourceMappingURL=production-hardening-v7.module.js.map