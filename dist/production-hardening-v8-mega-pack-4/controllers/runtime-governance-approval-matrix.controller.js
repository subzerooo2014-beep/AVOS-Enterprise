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
exports.RuntimeGovernanceApprovalMatrixController = void 0;
const common_1 = require("@nestjs/common");
const dto_1 = require("../dto");
const services_1 = require("../services");
let RuntimeGovernanceApprovalMatrixController = class RuntimeGovernanceApprovalMatrixController {
    constructor(matrix, requests) {
        this.matrix = matrix;
        this.requests = requests;
    }
    createRule(dto) {
        return this.matrix
            .createRule(dto);
    }
    listRules() {
        return this.matrix
            .listRules();
    }
    getRule(id) {
        return this.matrix
            .getRule(id);
    }
    evaluate(requestId) {
        const request = this.requests.get(requestId);
        return this.matrix
            .evaluate(request);
    }
};
exports.RuntimeGovernanceApprovalMatrixController = RuntimeGovernanceApprovalMatrixController;
__decorate([
    (0, common_1.Post)("rules"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateApprovalMatrixRuleDto]),
    __metadata("design:returntype", void 0)
], RuntimeGovernanceApprovalMatrixController.prototype, "createRule", null);
__decorate([
    (0, common_1.Get)("rules"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RuntimeGovernanceApprovalMatrixController.prototype, "listRules", null);
__decorate([
    (0, common_1.Get)("rules/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RuntimeGovernanceApprovalMatrixController.prototype, "getRule", null);
__decorate([
    (0, common_1.Post)("requests/:requestId/evaluate"),
    __param(0, (0, common_1.Param)("requestId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RuntimeGovernanceApprovalMatrixController.prototype, "evaluate", null);
exports.RuntimeGovernanceApprovalMatrixController = RuntimeGovernanceApprovalMatrixController = __decorate([
    (0, common_1.Controller)("production-hardening-v8-mega-pack-4/approval-matrix"),
    __metadata("design:paramtypes", [services_1.RuntimeGovernanceApprovalMatrixService,
        services_1.RuntimeGovernanceRequestService])
], RuntimeGovernanceApprovalMatrixController);
//# sourceMappingURL=runtime-governance-approval-matrix.controller.js.map