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
exports.AssuranceReportService = void 0;
const common_1 = require("@nestjs/common");
const node_crypto_1 = require("node:crypto");
const assurance_storage_service_1 = require("./assurance-storage.service");
const continuous_assurance_service_1 = require("./continuous-assurance.service");
const compliance_drift_service_1 = require("./compliance-drift.service");
const enterprise_risk_service_1 = require("./enterprise-risk.service");
const incident_readiness_service_1 = require("./incident-readiness.service");
const remediation_service_1 = require("./remediation.service");
let AssuranceReportService = class AssuranceReportService {
    constructor(storage, assurance, drift, risks, readiness, remediation) {
        this.storage = storage;
        this.assurance = assurance;
        this.drift = drift;
        this.risks = risks;
        this.readiness = readiness;
        this.remediation = remediation;
        this.collection = "assurance-reports";
    }
    async generate(reportType = "continuous_assurance") {
        let latestAssurance = await this.assurance.getLatestRun();
        if (!latestAssurance) {
            latestAssurance =
                await this.assurance.runAssurance("scheduled");
        }
        let latestReadiness = await this.readiness.latest();
        if (!latestReadiness) {
            latestReadiness =
                await this.readiness.assess();
        }
        const driftSummary = await this.drift.summary();
        const riskSummary = await this.risks.summary();
        const remediationSummary = await this.remediation.summary();
        const overallStatus = this.calculateOverallStatus({
            assuranceStatus: latestAssurance.status,
            criticalDrift: driftSummary.criticalOpen,
            criticalRisks: riskSummary.critical,
            criticalRemediations: remediationSummary.criticalOpen,
            readinessScore: latestReadiness.score,
        });
        const recommendations = [];
        if (latestAssurance.failedControls > 0) {
            recommendations.push("Create remediation plans for every failed assurance control.");
        }
        if (driftSummary.open > 0) {
            recommendations.push("Review and resolve open compliance drift events.");
        }
        if (riskSummary.normalizedRiskScore >= 40) {
            recommendations.push("Reduce aggregate residual enterprise risk.");
        }
        if (latestReadiness.score < 90) {
            recommendations.push("Complete incident readiness capability gaps.");
        }
        if (recommendations.length === 0) {
            recommendations.push("Maintain continuous assurance runs and evidence retention.");
        }
        const now = new Date().toISOString();
        const report = {
            id: (0, node_crypto_1.randomUUID)(),
            reportType,
            generatedAt: now,
            overallStatus,
            assuranceScore: latestAssurance.score,
            riskScore: riskSummary.normalizedRiskScore,
            readinessScore: latestReadiness.score,
            openDriftEvents: driftSummary.open,
            openRemediations: remediationSummary.open +
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
        await this.storage.append(this.collection, report);
        return report;
    }
    async list() {
        const reports = await this.storage.readCollection(this.collection);
        return reports.sort((a, b) => b.generatedAt.localeCompare(a.generatedAt));
    }
    calculateOverallStatus(input) {
        if (input.assuranceStatus === "critical" ||
            input.criticalDrift > 0 ||
            input.criticalRisks > 0 ||
            input.criticalRemediations > 0) {
            return "critical";
        }
        if (input.assuranceStatus === "degraded" ||
            input.readinessScore < 60) {
            return "degraded";
        }
        if (input.assuranceStatus === "warning" ||
            input.readinessScore < 90) {
            return "warning";
        }
        return "healthy";
    }
};
exports.AssuranceReportService = AssuranceReportService;
exports.AssuranceReportService = AssuranceReportService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [assurance_storage_service_1.AssuranceStorageService,
        continuous_assurance_service_1.ContinuousAssuranceService,
        compliance_drift_service_1.ComplianceDriftService,
        enterprise_risk_service_1.EnterpriseRiskService,
        incident_readiness_service_1.IncidentReadinessService,
        remediation_service_1.RemediationService])
], AssuranceReportService);
//# sourceMappingURL=assurance-report.service.js.map