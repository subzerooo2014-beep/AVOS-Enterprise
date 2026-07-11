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
exports.RiskTreatmentController = void 0;
const common_1 = require("@nestjs/common");
const approval_submit_dto_1 = require("./dto/approval-submit.dto");
const create_risk_treatment_dto_1 = require("./dto/create-risk-treatment.dto");
const update_operational_status_dto_1 = require("./dto/update-operational-status.dto");
const update_risk_treatment_status_dto_1 = require("./dto/update-risk-treatment-status.dto");
const risk_treatment_service_1 = require("./risk-treatment.service");
let RiskTreatmentController = class RiskTreatmentController {
    constructor(treatments) {
        this.treatments = treatments;
    }
    create(dto) {
        return this.treatments.create(dto);
    }
    list(status) {
        return this.treatments.list(status);
    }
    summary() {
        return this.treatments.summary();
    }
    get(id) {
        return this.treatments.get(id);
    }
    submitApproval(id, dto) {
        return this.treatments
            .submitForApproval(id, dto.approvers, dto.minimumApprovals);
    }
    syncApproval(id) {
        return this.treatments
            .synchronizeApproval(id);
    }
    updateStatus(id, dto) {
        return this.treatments
            .updateStatus(id, dto.status);
    }
    updateTaskStatus(planId, taskId, dto) {
        return this.treatments
            .updateTaskStatus(planId, taskId, dto.status, dto.output);
    }
};
exports.RiskTreatmentController = RiskTreatmentController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_risk_treatment_dto_1.CreateRiskTreatmentDto]),
    __metadata("design:returntype", void 0)
], RiskTreatmentController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)("status")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RiskTreatmentController.prototype, "list", null);
__decorate([
    (0, common_1.Get)("summary"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RiskTreatmentController.prototype, "summary", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RiskTreatmentController.prototype, "get", null);
__decorate([
    (0, common_1.Post)(":id/submit-approval"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, approval_submit_dto_1.ApprovalSubmitDto]),
    __metadata("design:returntype", void 0)
], RiskTreatmentController.prototype, "submitApproval", null);
__decorate([
    (0, common_1.Post)(":id/sync-approval"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RiskTreatmentController.prototype, "syncApproval", null);
__decorate([
    (0, common_1.Patch)(":id/status"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_risk_treatment_status_dto_1.UpdateRiskTreatmentStatusDto]),
    __metadata("design:returntype", void 0)
], RiskTreatmentController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Patch)(":planId/tasks/:taskId/status"),
    __param(0, (0, common_1.Param)("planId")),
    __param(1, (0, common_1.Param)("taskId")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_operational_status_dto_1.UpdateOperationalStatusDto]),
    __metadata("design:returntype", void 0)
], RiskTreatmentController.prototype, "updateTaskStatus", null);
exports.RiskTreatmentController = RiskTreatmentController = __decorate([
    (0, common_1.Controller)("production-hardening-v7/mega-pack-6/risk-treatments"),
    __metadata("design:paramtypes", [risk_treatment_service_1.RiskTreatmentService])
], RiskTreatmentController);
//# sourceMappingURL=risk-treatment.controller.js.map