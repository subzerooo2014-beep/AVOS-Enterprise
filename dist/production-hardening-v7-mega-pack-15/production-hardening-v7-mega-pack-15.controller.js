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
exports.ProductionHardeningV7MegaPack15Controller = void 0;
const common_1 = require("@nestjs/common");
const consolidate_evidence_dto_1 = require("./dto/consolidate-evidence.dto");
const create_certification_dto_1 = require("./dto/create-certification.dto");
const create_executive_sign_off_dto_1 = require("./dto/create-executive-sign-off.dto");
const create_operational_acceptance_dto_1 = require("./dto/create-operational-acceptance.dto");
const evaluate_certification_dto_1 = require("./dto/evaluate-certification.dto");
const production_hardening_v7_mega_pack_15_service_1 = require("./production-hardening-v7-mega-pack-15.service");
let ProductionHardeningV7MegaPack15Controller = class ProductionHardeningV7MegaPack15Controller {
    constructor(service) {
        this.service = service;
    }
    status() {
        return this.service.getStatus();
    }
    snapshot() {
        return {
            success: true,
            snapshot: this.service.getSnapshot(),
        };
    }
    verify() {
        return this.service.runVerification();
    }
    verifyEvidence() {
        return {
            success: true,
            ...this.service.verifyEvidenceChain(),
        };
    }
    evidence() {
        return {
            success: true,
            entries: this.service.listEvidenceEntries(),
        };
    }
    events() {
        return {
            success: true,
            events: this.service.listPlatformEvents(),
        };
    }
    createCertification(dto) {
        return {
            success: true,
            certification: this.service.createCertification(dto, "api"),
        };
    }
    listCertifications() {
        return {
            success: true,
            certifications: this.service.listCertifications(),
        };
    }
    getCertification(certificationId) {
        return {
            success: true,
            certification: this.service.getCertification(certificationId),
        };
    }
    evaluateCertification(certificationId, dto) {
        return {
            success: true,
            scorecard: this.service.evaluateCertification(certificationId, dto, "api"),
        };
    }
    listGates(certificationId) {
        return {
            success: true,
            gates: this.service.listGates(certificationId),
        };
    }
    listScorecards() {
        return {
            success: true,
            scorecards: this.service.listScorecards(),
        };
    }
    createOperationalAcceptance(certificationId, dto) {
        return {
            success: true,
            acceptance: this.service.createOperationalAcceptance(certificationId, dto, "api"),
        };
    }
    approveOperationalAcceptance(acceptanceId) {
        return {
            success: true,
            acceptance: this.service.approveOperationalAcceptance(acceptanceId, "api"),
        };
    }
    listOperationalAcceptances() {
        return {
            success: true,
            acceptances: this.service.listOperationalAcceptances(),
        };
    }
    createExecutiveSignOff(certificationId, dto) {
        return {
            success: true,
            signOff: this.service.createExecutiveSignOff(certificationId, dto, "api"),
        };
    }
    approveExecutiveSignOff(signOffId) {
        return {
            success: true,
            signOff: this.service.approveExecutiveSignOff(signOffId, "api"),
        };
    }
    listExecutiveSignOffs() {
        return {
            success: true,
            signOffs: this.service.listExecutiveSignOffs(),
        };
    }
    consolidateEvidence(certificationId, dto) {
        return {
            success: true,
            consolidation: this.service.consolidateEvidence(certificationId, dto, "api"),
        };
    }
    listEvidenceConsolidations() {
        return {
            success: true,
            consolidations: this.service.listEvidenceConsolidations(),
        };
    }
    certifyProduction(certificationId) {
        return {
            success: true,
            certification: this.service.certifyProduction(certificationId, "api"),
        };
    }
    issueCertificateDocument(certificationId) {
        return {
            success: true,
            certificate: this.service.issueCertificateDocument(certificationId, "api"),
        };
    }
    listCertificateDocuments() {
        return {
            success: true,
            certificates: this.service.listCertificateDocuments(),
        };
    }
};
exports.ProductionHardeningV7MegaPack15Controller = ProductionHardeningV7MegaPack15Controller;
__decorate([
    (0, common_1.Get)("status"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack15Controller.prototype, "status", null);
__decorate([
    (0, common_1.Get)("snapshot"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack15Controller.prototype, "snapshot", null);
__decorate([
    (0, common_1.Get)("verify"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack15Controller.prototype, "verify", null);
__decorate([
    (0, common_1.Get)("evidence/verify"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack15Controller.prototype, "verifyEvidence", null);
__decorate([
    (0, common_1.Get)("evidence"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack15Controller.prototype, "evidence", null);
__decorate([
    (0, common_1.Get)("events"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack15Controller.prototype, "events", null);
__decorate([
    (0, common_1.Post)("certifications"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_certification_dto_1.CreateCertificationDto]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack15Controller.prototype, "createCertification", null);
__decorate([
    (0, common_1.Get)("certifications"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack15Controller.prototype, "listCertifications", null);
__decorate([
    (0, common_1.Get)("certifications/:certificationId"),
    __param(0, (0, common_1.Param)("certificationId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack15Controller.prototype, "getCertification", null);
__decorate([
    (0, common_1.Post)("certifications/:certificationId/evaluate"),
    __param(0, (0, common_1.Param)("certificationId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, evaluate_certification_dto_1.EvaluateCertificationDto]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack15Controller.prototype, "evaluateCertification", null);
__decorate([
    (0, common_1.Get)("readiness-gates"),
    __param(0, (0, common_1.Query)("certificationId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack15Controller.prototype, "listGates", null);
__decorate([
    (0, common_1.Get)("scorecards"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack15Controller.prototype, "listScorecards", null);
__decorate([
    (0, common_1.Post)("certifications/:certificationId/operational-acceptance"),
    __param(0, (0, common_1.Param)("certificationId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_operational_acceptance_dto_1.CreateOperationalAcceptanceDto]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack15Controller.prototype, "createOperationalAcceptance", null);
__decorate([
    (0, common_1.Post)("operational-acceptances/:acceptanceId/approve"),
    __param(0, (0, common_1.Param)("acceptanceId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack15Controller.prototype, "approveOperationalAcceptance", null);
__decorate([
    (0, common_1.Get)("operational-acceptances"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack15Controller.prototype, "listOperationalAcceptances", null);
__decorate([
    (0, common_1.Post)("certifications/:certificationId/executive-signoff"),
    __param(0, (0, common_1.Param)("certificationId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_executive_sign_off_dto_1.CreateExecutiveSignOffDto]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack15Controller.prototype, "createExecutiveSignOff", null);
__decorate([
    (0, common_1.Post)("executive-signoffs/:signOffId/approve"),
    __param(0, (0, common_1.Param)("signOffId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack15Controller.prototype, "approveExecutiveSignOff", null);
__decorate([
    (0, common_1.Get)("executive-signoffs"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack15Controller.prototype, "listExecutiveSignOffs", null);
__decorate([
    (0, common_1.Post)("certifications/:certificationId/consolidate-evidence"),
    __param(0, (0, common_1.Param)("certificationId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, consolidate_evidence_dto_1.ConsolidateEvidenceDto]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack15Controller.prototype, "consolidateEvidence", null);
__decorate([
    (0, common_1.Get)("evidence-consolidations"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack15Controller.prototype, "listEvidenceConsolidations", null);
__decorate([
    (0, common_1.Post)("certifications/:certificationId/certify"),
    __param(0, (0, common_1.Param)("certificationId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack15Controller.prototype, "certifyProduction", null);
__decorate([
    (0, common_1.Post)("certifications/:certificationId/issue-certificate"),
    __param(0, (0, common_1.Param)("certificationId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack15Controller.prototype, "issueCertificateDocument", null);
__decorate([
    (0, common_1.Get)("certificate-documents"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack15Controller.prototype, "listCertificateDocuments", null);
exports.ProductionHardeningV7MegaPack15Controller = ProductionHardeningV7MegaPack15Controller = __decorate([
    (0, common_1.Controller)("production-hardening-v7-mega-pack-15"),
    __metadata("design:paramtypes", [production_hardening_v7_mega_pack_15_service_1.ProductionHardeningV7MegaPack15Service])
], ProductionHardeningV7MegaPack15Controller);
//# sourceMappingURL=production-hardening-v7-mega-pack-15.controller.js.map