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
exports.ProductionHardeningV7MegaPack7Controller = void 0;
const common_1 = require("@nestjs/common");
const production_hardening_v7_mega_pack_7_dto_1 = require("./production-hardening-v7-mega-pack-7.dto");
const production_hardening_v7_mega_pack_7_service_1 = require("./production-hardening-v7-mega-pack-7.service");
let ProductionHardeningV7MegaPack7Controller = class ProductionHardeningV7MegaPack7Controller {
    constructor(service) {
        this.service = service;
    }
    getStatus() {
        return this.service.getStatus();
    }
    getSnapshot() {
        return this.service.getSnapshot();
    }
    verifyEvidenceChain() {
        return this.service.verifyEvidenceChain();
    }
    listSlos() {
        return this.service.listSlos();
    }
    createSlo(dto) {
        return this.service.createSlo(dto);
    }
    recordSignal(sloId, dto) {
        return this.service.recordSignal(sloId, dto);
    }
    listIncidents() {
        return this.service.listIncidents();
    }
    createIncident(dto) {
        return this.service.createIncident(dto);
    }
    resolveIncident(incidentId, dto) {
        return this.service.resolveIncident(incidentId, dto);
    }
    evaluateRelease(dto) {
        return this.service.evaluateRelease(dto);
    }
    listContinuityPlans() {
        return this.service.listContinuityPlans();
    }
    createContinuityPlan(dto) {
        return this.service.createContinuityPlan(dto);
    }
    testContinuityPlan(planId, dto) {
        return this.service.testContinuityPlan(planId, dto);
    }
    listChaosDrills() {
        return this.service.listChaosDrills();
    }
    createChaosDrill(dto) {
        return this.service.createChaosDrill(dto);
    }
    startChaosDrill(drillId) {
        return this.service.startChaosDrill(drillId);
    }
    completeChaosDrill(drillId, dto) {
        return this.service.completeChaosDrill(drillId, dto);
    }
};
exports.ProductionHardeningV7MegaPack7Controller = ProductionHardeningV7MegaPack7Controller;
__decorate([
    (0, common_1.Get)("status"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack7Controller.prototype, "getStatus", null);
__decorate([
    (0, common_1.Get)("snapshot"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack7Controller.prototype, "getSnapshot", null);
__decorate([
    (0, common_1.Get)("evidence/verify"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack7Controller.prototype, "verifyEvidenceChain", null);
__decorate([
    (0, common_1.Get)("slos"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack7Controller.prototype, "listSlos", null);
__decorate([
    (0, common_1.Post)("slos"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [production_hardening_v7_mega_pack_7_dto_1.CreateSloDto]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack7Controller.prototype, "createSlo", null);
__decorate([
    (0, common_1.Post)("slos/:sloId/signals"),
    __param(0, (0, common_1.Param)("sloId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, production_hardening_v7_mega_pack_7_dto_1.RecordSloSignalDto]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack7Controller.prototype, "recordSignal", null);
__decorate([
    (0, common_1.Get)("incidents"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack7Controller.prototype, "listIncidents", null);
__decorate([
    (0, common_1.Post)("incidents"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [production_hardening_v7_mega_pack_7_dto_1.CreateResilienceIncidentDto]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack7Controller.prototype, "createIncident", null);
__decorate([
    (0, common_1.Post)("incidents/:incidentId/resolve"),
    __param(0, (0, common_1.Param)("incidentId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, production_hardening_v7_mega_pack_7_dto_1.ResolveResilienceIncidentDto]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack7Controller.prototype, "resolveIncident", null);
__decorate([
    (0, common_1.Post)("release-gates/evaluate"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [production_hardening_v7_mega_pack_7_dto_1.EvaluateReleaseDto]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack7Controller.prototype, "evaluateRelease", null);
__decorate([
    (0, common_1.Get)("continuity-plans"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack7Controller.prototype, "listContinuityPlans", null);
__decorate([
    (0, common_1.Post)("continuity-plans"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [production_hardening_v7_mega_pack_7_dto_1.CreateContinuityPlanDto]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack7Controller.prototype, "createContinuityPlan", null);
__decorate([
    (0, common_1.Post)("continuity-plans/:planId/test"),
    __param(0, (0, common_1.Param)("planId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, production_hardening_v7_mega_pack_7_dto_1.TestContinuityPlanDto]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack7Controller.prototype, "testContinuityPlan", null);
__decorate([
    (0, common_1.Get)("chaos-drills"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack7Controller.prototype, "listChaosDrills", null);
__decorate([
    (0, common_1.Post)("chaos-drills"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [production_hardening_v7_mega_pack_7_dto_1.CreateChaosDrillDto]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack7Controller.prototype, "createChaosDrill", null);
__decorate([
    (0, common_1.Post)("chaos-drills/:drillId/start"),
    __param(0, (0, common_1.Param)("drillId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack7Controller.prototype, "startChaosDrill", null);
__decorate([
    (0, common_1.Post)("chaos-drills/:drillId/complete"),
    __param(0, (0, common_1.Param)("drillId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, production_hardening_v7_mega_pack_7_dto_1.CompleteChaosDrillDto]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack7Controller.prototype, "completeChaosDrill", null);
exports.ProductionHardeningV7MegaPack7Controller = ProductionHardeningV7MegaPack7Controller = __decorate([
    (0, common_1.Controller)("production-hardening-v7/mega-pack-7"),
    __metadata("design:paramtypes", [production_hardening_v7_mega_pack_7_service_1.ProductionHardeningV7MegaPack7Service])
], ProductionHardeningV7MegaPack7Controller);
//# sourceMappingURL=production-hardening-v7-mega-pack-7.controller.js.map