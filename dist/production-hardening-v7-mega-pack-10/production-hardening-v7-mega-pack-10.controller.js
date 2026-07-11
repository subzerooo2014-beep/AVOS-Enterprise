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
exports.ProductionHardeningV7MegaPack10Controller = void 0;
const common_1 = require("@nestjs/common");
const add_release_artifact_dto_1 = require("./dto/add-release-artifact.dto");
const approve_release_dto_1 = require("./dto/approve-release.dto");
const create_release_dto_1 = require("./dto/create-release.dto");
const create_rollback_plan_dto_1 = require("./dto/create-rollback-plan.dto");
const deploy_release_dto_1 = require("./dto/deploy-release.dto");
const evaluate_release_dto_1 = require("./dto/evaluate-release.dto");
const reject_release_dto_1 = require("./dto/reject-release.dto");
const production_hardening_v7_mega_pack_10_service_1 = require("./production-hardening-v7-mega-pack-10.service");
let ProductionHardeningV7MegaPack10Controller = class ProductionHardeningV7MegaPack10Controller {
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
    createRelease(dto) {
        return {
            success: true,
            release: this.service.createRelease(dto, "api"),
        };
    }
    listReleases() {
        return {
            success: true,
            releases: this.service.listReleases(),
        };
    }
    getRelease(releaseId) {
        return {
            success: true,
            release: this.service.getRelease(releaseId),
        };
    }
    addArtifact(releaseId, dto) {
        return {
            success: true,
            artifact: this.service.addArtifact(releaseId, dto, "api"),
        };
    }
    verifyArtifact(artifactId) {
        return {
            success: true,
            artifact: this.service.verifyArtifact(artifactId, "api"),
        };
    }
    listArtifacts(releaseId) {
        return {
            success: true,
            artifacts: this.service.listArtifacts(releaseId),
        };
    }
    createRollbackPlan(releaseId, dto) {
        return {
            success: true,
            rollbackPlan: this.service.createRollbackPlan(releaseId, dto, "api"),
        };
    }
    validateRollbackPlan(planId) {
        return {
            success: true,
            rollbackPlan: this.service.validateRollbackPlan(planId, "api"),
        };
    }
    listRollbackPlans(releaseId) {
        return {
            success: true,
            rollbackPlans: this.service.listRollbackPlans(releaseId),
        };
    }
    evaluateRelease(releaseId, dto) {
        return {
            success: true,
            assessment: this.service.evaluateRelease(releaseId, dto, "api"),
        };
    }
    approveRelease(releaseId, dto) {
        return {
            success: true,
            release: this.service.approveRelease(releaseId, dto),
        };
    }
    rejectRelease(releaseId, dto) {
        return {
            success: true,
            release: this.service.rejectRelease(releaseId, dto),
        };
    }
    deployRelease(releaseId, dto) {
        return {
            success: true,
            deployment: this.service.deployRelease(releaseId, dto),
        };
    }
    rollbackRelease(releaseId) {
        return {
            success: true,
            deployment: this.service.rollbackRelease(releaseId, "api"),
        };
    }
    listGates(releaseId) {
        return {
            success: true,
            gates: this.service.listGates(releaseId),
        };
    }
    listAssessments(releaseId) {
        return {
            success: true,
            assessments: this.service.listAssessments(releaseId),
        };
    }
    listDeployments(releaseId) {
        return {
            success: true,
            deployments: this.service.listDeployments(releaseId),
        };
    }
};
exports.ProductionHardeningV7MegaPack10Controller = ProductionHardeningV7MegaPack10Controller;
__decorate([
    (0, common_1.Get)("status"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack10Controller.prototype, "status", null);
__decorate([
    (0, common_1.Get)("snapshot"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack10Controller.prototype, "snapshot", null);
__decorate([
    (0, common_1.Get)("verify"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack10Controller.prototype, "verify", null);
__decorate([
    (0, common_1.Get)("evidence/verify"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack10Controller.prototype, "verifyEvidence", null);
__decorate([
    (0, common_1.Get)("evidence"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack10Controller.prototype, "evidence", null);
__decorate([
    (0, common_1.Get)("events"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack10Controller.prototype, "events", null);
__decorate([
    (0, common_1.Post)("releases"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_release_dto_1.CreateReleaseDto]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack10Controller.prototype, "createRelease", null);
__decorate([
    (0, common_1.Get)("releases"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack10Controller.prototype, "listReleases", null);
__decorate([
    (0, common_1.Get)("releases/:releaseId"),
    __param(0, (0, common_1.Param)("releaseId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack10Controller.prototype, "getRelease", null);
__decorate([
    (0, common_1.Post)("releases/:releaseId/artifacts"),
    __param(0, (0, common_1.Param)("releaseId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, add_release_artifact_dto_1.AddReleaseArtifactDto]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack10Controller.prototype, "addArtifact", null);
__decorate([
    (0, common_1.Post)("artifacts/:artifactId/verify"),
    __param(0, (0, common_1.Param)("artifactId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack10Controller.prototype, "verifyArtifact", null);
__decorate([
    (0, common_1.Get)("artifacts"),
    __param(0, (0, common_1.Query)("releaseId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack10Controller.prototype, "listArtifacts", null);
__decorate([
    (0, common_1.Post)("releases/:releaseId/rollback-plans"),
    __param(0, (0, common_1.Param)("releaseId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_rollback_plan_dto_1.CreateRollbackPlanDto]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack10Controller.prototype, "createRollbackPlan", null);
__decorate([
    (0, common_1.Post)("rollback-plans/:planId/validate"),
    __param(0, (0, common_1.Param)("planId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack10Controller.prototype, "validateRollbackPlan", null);
__decorate([
    (0, common_1.Get)("rollback-plans"),
    __param(0, (0, common_1.Query)("releaseId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack10Controller.prototype, "listRollbackPlans", null);
__decorate([
    (0, common_1.Post)("releases/:releaseId/evaluate"),
    __param(0, (0, common_1.Param)("releaseId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, evaluate_release_dto_1.EvaluateReleaseDto]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack10Controller.prototype, "evaluateRelease", null);
__decorate([
    (0, common_1.Post)("releases/:releaseId/approve"),
    __param(0, (0, common_1.Param)("releaseId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, approve_release_dto_1.ApproveReleaseDto]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack10Controller.prototype, "approveRelease", null);
__decorate([
    (0, common_1.Post)("releases/:releaseId/reject"),
    __param(0, (0, common_1.Param)("releaseId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, reject_release_dto_1.RejectReleaseDto]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack10Controller.prototype, "rejectRelease", null);
__decorate([
    (0, common_1.Post)("releases/:releaseId/deploy"),
    __param(0, (0, common_1.Param)("releaseId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, deploy_release_dto_1.DeployReleaseDto]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack10Controller.prototype, "deployRelease", null);
__decorate([
    (0, common_1.Post)("releases/:releaseId/rollback"),
    __param(0, (0, common_1.Param)("releaseId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack10Controller.prototype, "rollbackRelease", null);
__decorate([
    (0, common_1.Get)("release-gates"),
    __param(0, (0, common_1.Query)("releaseId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack10Controller.prototype, "listGates", null);
__decorate([
    (0, common_1.Get)("readiness-assessments"),
    __param(0, (0, common_1.Query)("releaseId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack10Controller.prototype, "listAssessments", null);
__decorate([
    (0, common_1.Get)("deployments"),
    __param(0, (0, common_1.Query)("releaseId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack10Controller.prototype, "listDeployments", null);
exports.ProductionHardeningV7MegaPack10Controller = ProductionHardeningV7MegaPack10Controller = __decorate([
    (0, common_1.Controller)("production-hardening-v7-mega-pack-10"),
    __metadata("design:paramtypes", [production_hardening_v7_mega_pack_10_service_1.ProductionHardeningV7MegaPack10Service])
], ProductionHardeningV7MegaPack10Controller);
//# sourceMappingURL=production-hardening-v7-mega-pack-10.controller.js.map