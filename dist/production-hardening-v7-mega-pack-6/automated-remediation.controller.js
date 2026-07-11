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
exports.AutomatedRemediationController = void 0;
const common_1 = require("@nestjs/common");
const automated_remediation_service_1 = require("./automated-remediation.service");
const approval_submit_dto_1 = require("./dto/approval-submit.dto");
const create_automated_remediation_dto_1 = require("./dto/create-automated-remediation.dto");
const execute_remediation_dto_1 = require("./dto/execute-remediation.dto");
let AutomatedRemediationController = class AutomatedRemediationController {
    constructor(remediations) {
        this.remediations = remediations;
    }
    create(dto) {
        return this.remediations.create(dto);
    }
    list() {
        return this.remediations.list();
    }
    get(id) {
        return this.remediations.get(id);
    }
    requestApproval(id, dto) {
        return this.remediations
            .requestApproval(id, dto.approvers, dto.minimumApprovals);
    }
    syncApproval(id) {
        return this.remediations
            .synchronizeApproval(id);
    }
    execute(id, dto) {
        return this.remediations.execute(id, dto);
    }
};
exports.AutomatedRemediationController = AutomatedRemediationController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_automated_remediation_dto_1.CreateAutomatedRemediationDto]),
    __metadata("design:returntype", void 0)
], AutomatedRemediationController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AutomatedRemediationController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AutomatedRemediationController.prototype, "get", null);
__decorate([
    (0, common_1.Post)(":id/request-approval"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, approval_submit_dto_1.ApprovalSubmitDto]),
    __metadata("design:returntype", void 0)
], AutomatedRemediationController.prototype, "requestApproval", null);
__decorate([
    (0, common_1.Post)(":id/sync-approval"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AutomatedRemediationController.prototype, "syncApproval", null);
__decorate([
    (0, common_1.Post)(":id/execute"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, execute_remediation_dto_1.ExecuteRemediationDto]),
    __metadata("design:returntype", void 0)
], AutomatedRemediationController.prototype, "execute", null);
exports.AutomatedRemediationController = AutomatedRemediationController = __decorate([
    (0, common_1.Controller)("production-hardening-v7/mega-pack-6/remediations"),
    __metadata("design:paramtypes", [automated_remediation_service_1.AutomatedRemediationService])
], AutomatedRemediationController);
//# sourceMappingURL=automated-remediation.controller.js.map