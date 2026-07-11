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
exports.GovernanceReportsController = void 0;
const common_1 = require("@nestjs/common");
const generate_compliance_report_dto_1 = require("../dto/generate-compliance-report.dto");
const generate_evidence_package_dto_1 = require("../dto/generate-evidence-package.dto");
const governance_compliance_report_service_1 = require("../services/governance-compliance-report.service");
const governance_evidence_vault_service_1 = require("../services/governance-evidence-vault.service");
const governance_record_verification_service_1 = require("../services/governance-record-verification.service");
const v6_diagnostics_token_guard_1 = require("../services/v6-diagnostics-token.guard");
let GovernanceReportsController = class GovernanceReportsController {
    constructor(compliance, evidence, verification) {
        this.compliance = compliance;
        this.evidence = evidence;
        this.verification = verification;
    }
    async generateCompliance(dto, request) {
        return {
            success: true,
            snapshot: await this.compliance.generate({
                reportType: dto.reportType ??
                    "full",
                generatedBy: dto.generatedBy ??
                    request.headers?.["x-avos-actor"] ??
                    "platform-owner",
                correlationId: request.headers?.["x-correlation-id"],
                traceId: request.headers?.["x-trace-id"],
            }),
        };
    }
    async listCompliance(limit) {
        return {
            success: true,
            snapshots: await this.compliance.findAll(Number(limit) || 100),
        };
    }
    async latestCompliance() {
        return {
            success: true,
            snapshot: await this.compliance.latest(),
        };
    }
    async getCompliance(id) {
        return {
            success: true,
            snapshot: await this.compliance.findOne(id),
        };
    }
    async verifyCompliance(id) {
        return {
            success: true,
            verification: await this.verification
                .verifyCompliance(id),
        };
    }
    async generateEvidence(dto, request) {
        return {
            success: true,
            package: await this.evidence.generate({
                packageType: dto.packageType ??
                    "full_governance",
                description: dto.description,
                generatedBy: dto.generatedBy ??
                    request.headers?.["x-avos-actor"] ??
                    "platform-owner",
                correlationId: request.headers?.["x-correlation-id"],
                traceId: request.headers?.["x-trace-id"],
            }),
        };
    }
    async listEvidence(limit) {
        return {
            success: true,
            packages: await this.evidence.findAll(Number(limit) || 100),
        };
    }
    async latestEvidence() {
        return {
            success: true,
            package: await this.evidence.latest(),
        };
    }
    async getEvidence(id) {
        return {
            success: true,
            package: await this.evidence.findOne(id),
        };
    }
    async verifyEvidence(id) {
        return {
            success: true,
            verification: await this.verification
                .verifyEvidence(id),
        };
    }
};
exports.GovernanceReportsController = GovernanceReportsController;
__decorate([
    (0, common_1.Post)("compliance/generate"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [generate_compliance_report_dto_1.GenerateComplianceReportDto, Object]),
    __metadata("design:returntype", Promise)
], GovernanceReportsController.prototype, "generateCompliance", null);
__decorate([
    (0, common_1.Get)("compliance"),
    __param(0, (0, common_1.Query)("limit")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GovernanceReportsController.prototype, "listCompliance", null);
__decorate([
    (0, common_1.Get)("compliance/latest"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GovernanceReportsController.prototype, "latestCompliance", null);
__decorate([
    (0, common_1.Get)("compliance/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GovernanceReportsController.prototype, "getCompliance", null);
__decorate([
    (0, common_1.Get)("compliance/:id/verify"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GovernanceReportsController.prototype, "verifyCompliance", null);
__decorate([
    (0, common_1.Post)("evidence/generate"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [generate_evidence_package_dto_1.GenerateEvidencePackageDto, Object]),
    __metadata("design:returntype", Promise)
], GovernanceReportsController.prototype, "generateEvidence", null);
__decorate([
    (0, common_1.Get)("evidence"),
    __param(0, (0, common_1.Query)("limit")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GovernanceReportsController.prototype, "listEvidence", null);
__decorate([
    (0, common_1.Get)("evidence/latest"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GovernanceReportsController.prototype, "latestEvidence", null);
__decorate([
    (0, common_1.Get)("evidence/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GovernanceReportsController.prototype, "getEvidence", null);
__decorate([
    (0, common_1.Get)("evidence/:id/verify"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GovernanceReportsController.prototype, "verifyEvidence", null);
exports.GovernanceReportsController = GovernanceReportsController = __decorate([
    (0, common_1.Controller)("platform-hardening/v6/governance"),
    (0, common_1.UseGuards)(v6_diagnostics_token_guard_1.V6DiagnosticsTokenGuard),
    __metadata("design:paramtypes", [governance_compliance_report_service_1.GovernanceComplianceReportService,
        governance_evidence_vault_service_1.GovernanceEvidenceVaultService,
        governance_record_verification_service_1.GovernanceRecordVerificationService])
], GovernanceReportsController);
//# sourceMappingURL=governance-reports.controller.js.map