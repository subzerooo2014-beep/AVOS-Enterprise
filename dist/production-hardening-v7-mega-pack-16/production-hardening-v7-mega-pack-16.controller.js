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
exports.ProductionHardeningV7MegaPack16Controller = void 0;
const common_1 = require("@nestjs/common");
const create_closure_dto_1 = require("./dto/create-closure.dto");
const create_consistency_check_dto_1 = require("./dto/create-consistency-check.dto");
const create_transition_package_dto_1 = require("./dto/create-transition-package.dto");
const register_mega_pack_validation_dto_1 = require("./dto/register-mega-pack-validation.dto");
const production_hardening_v7_mega_pack_16_service_1 = require("./production-hardening-v7-mega-pack-16.service");
let ProductionHardeningV7MegaPack16Controller = class ProductionHardeningV7MegaPack16Controller {
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
    createClosure(dto) {
        return {
            success: true,
            closure: this.service.createClosure(dto, "api"),
        };
    }
    listClosures() {
        return {
            success: true,
            closures: this.service.listClosures(),
        };
    }
    getClosure(closureId) {
        return {
            success: true,
            closure: this.service.getClosure(closureId),
        };
    }
    registerMegaPackValidation(closureId, dto) {
        return {
            success: true,
            validation: this.service.registerMegaPackValidation(closureId, dto, "api"),
        };
    }
    listMegaPackValidations(closureId) {
        return {
            success: true,
            validations: this.service.listMegaPackValidations(closureId),
        };
    }
    createConsistencyCheck(closureId, dto) {
        return {
            success: true,
            check: this.service.createConsistencyCheck(closureId, dto, "api"),
        };
    }
    listConsistencyChecks(closureId) {
        return {
            success: true,
            checks: this.service.listConsistencyChecks(closureId),
        };
    }
    createBaseline(closureId) {
        return {
            success: true,
            baseline: this.service.createImmutableBaseline(closureId, "api"),
        };
    }
    sealBaseline(baselineId) {
        return {
            success: true,
            baseline: this.service.sealBaseline(baselineId, "api"),
        };
    }
    verifyBaseline(baselineId) {
        return {
            success: true,
            baseline: this.service.verifyBaseline(baselineId, "api"),
        };
    }
    listBaselines() {
        return {
            success: true,
            baselines: this.service.listBaselines(),
        };
    }
    generateExecutiveReport(closureId) {
        return {
            success: true,
            report: this.service.generateExecutiveReport(closureId, "api"),
        };
    }
    listExecutiveReports() {
        return {
            success: true,
            reports: this.service.listExecutiveReports(),
        };
    }
    issueCertificate(closureId) {
        return {
            success: true,
            certificate: this.service.issueCompletionCertificate(closureId, "api"),
        };
    }
    listCertificates() {
        return {
            success: true,
            certificates: this.service.listCertificates(),
        };
    }
    createTransitionPackage(closureId, dto) {
        return {
            success: true,
            transitionPackage: this.service.createTransitionPackage(closureId, dto, "api"),
        };
    }
    acceptTransitionPackage(transitionPackageId) {
        return {
            success: true,
            transitionPackage: this.service.acceptTransitionPackage(transitionPackageId, "api"),
        };
    }
    listTransitionPackages() {
        return {
            success: true,
            transitionPackages: this.service.listTransitionPackages(),
        };
    }
    completeClosure(closureId) {
        return {
            success: true,
            closure: this.service.completeClosure(closureId, "api"),
        };
    }
};
exports.ProductionHardeningV7MegaPack16Controller = ProductionHardeningV7MegaPack16Controller;
__decorate([
    (0, common_1.Get)("status"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack16Controller.prototype, "status", null);
__decorate([
    (0, common_1.Get)("snapshot"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack16Controller.prototype, "snapshot", null);
__decorate([
    (0, common_1.Get)("verify"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack16Controller.prototype, "verify", null);
__decorate([
    (0, common_1.Get)("evidence/verify"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack16Controller.prototype, "verifyEvidence", null);
__decorate([
    (0, common_1.Get)("evidence"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack16Controller.prototype, "evidence", null);
__decorate([
    (0, common_1.Get)("events"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack16Controller.prototype, "events", null);
__decorate([
    (0, common_1.Post)("closures"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_closure_dto_1.CreateClosureDto]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack16Controller.prototype, "createClosure", null);
__decorate([
    (0, common_1.Get)("closures"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack16Controller.prototype, "listClosures", null);
__decorate([
    (0, common_1.Get)("closures/:closureId"),
    __param(0, (0, common_1.Param)("closureId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack16Controller.prototype, "getClosure", null);
__decorate([
    (0, common_1.Post)("closures/:closureId/mega-pack-validations"),
    __param(0, (0, common_1.Param)("closureId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, register_mega_pack_validation_dto_1.RegisterMegaPackValidationDto]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack16Controller.prototype, "registerMegaPackValidation", null);
__decorate([
    (0, common_1.Get)("mega-pack-validations"),
    __param(0, (0, common_1.Query)("closureId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack16Controller.prototype, "listMegaPackValidations", null);
__decorate([
    (0, common_1.Post)("closures/:closureId/consistency-checks"),
    __param(0, (0, common_1.Param)("closureId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_consistency_check_dto_1.CreateConsistencyCheckDto]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack16Controller.prototype, "createConsistencyCheck", null);
__decorate([
    (0, common_1.Get)("consistency-checks"),
    __param(0, (0, common_1.Query)("closureId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack16Controller.prototype, "listConsistencyChecks", null);
__decorate([
    (0, common_1.Post)("closures/:closureId/create-baseline"),
    __param(0, (0, common_1.Param)("closureId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack16Controller.prototype, "createBaseline", null);
__decorate([
    (0, common_1.Post)("baselines/:baselineId/seal"),
    __param(0, (0, common_1.Param)("baselineId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack16Controller.prototype, "sealBaseline", null);
__decorate([
    (0, common_1.Post)("baselines/:baselineId/verify"),
    __param(0, (0, common_1.Param)("baselineId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack16Controller.prototype, "verifyBaseline", null);
__decorate([
    (0, common_1.Get)("baselines"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack16Controller.prototype, "listBaselines", null);
__decorate([
    (0, common_1.Post)("closures/:closureId/executive-report"),
    __param(0, (0, common_1.Param)("closureId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack16Controller.prototype, "generateExecutiveReport", null);
__decorate([
    (0, common_1.Get)("executive-reports"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack16Controller.prototype, "listExecutiveReports", null);
__decorate([
    (0, common_1.Post)("closures/:closureId/issue-certificate"),
    __param(0, (0, common_1.Param)("closureId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack16Controller.prototype, "issueCertificate", null);
__decorate([
    (0, common_1.Get)("certificates"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack16Controller.prototype, "listCertificates", null);
__decorate([
    (0, common_1.Post)("closures/:closureId/transition-package"),
    __param(0, (0, common_1.Param)("closureId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_transition_package_dto_1.CreateTransitionPackageDto]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack16Controller.prototype, "createTransitionPackage", null);
__decorate([
    (0, common_1.Post)("transition-packages/:transitionPackageId/accept"),
    __param(0, (0, common_1.Param)("transitionPackageId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack16Controller.prototype, "acceptTransitionPackage", null);
__decorate([
    (0, common_1.Get)("transition-packages"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack16Controller.prototype, "listTransitionPackages", null);
__decorate([
    (0, common_1.Post)("closures/:closureId/complete"),
    __param(0, (0, common_1.Param)("closureId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack16Controller.prototype, "completeClosure", null);
exports.ProductionHardeningV7MegaPack16Controller = ProductionHardeningV7MegaPack16Controller = __decorate([
    (0, common_1.Controller)("production-hardening-v7-mega-pack-16"),
    __metadata("design:paramtypes", [production_hardening_v7_mega_pack_16_service_1.ProductionHardeningV7MegaPack16Service])
], ProductionHardeningV7MegaPack16Controller);
//# sourceMappingURL=production-hardening-v7-mega-pack-16.controller.js.map