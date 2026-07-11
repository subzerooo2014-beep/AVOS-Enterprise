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
exports.RuntimeGovernanceRetentionController = void 0;
const common_1 = require("@nestjs/common");
const dto_1 = require("../dto");
const services_1 = require("../services");
let RuntimeGovernanceRetentionController = class RuntimeGovernanceRetentionController {
    constructor(retention) {
        this.retention = retention;
    }
    createPolicy(dto) {
        return this.retention.create(dto);
    }
    listPolicies() {
        return this.retention.list();
    }
    listEvaluations() {
        return this.retention
            .listEvaluations();
    }
    updateStatus(id, dto) {
        return this.retention
            .updateStatus(id, dto);
    }
    evaluate(body) {
        return this.retention
            .evaluate(body);
    }
};
exports.RuntimeGovernanceRetentionController = RuntimeGovernanceRetentionController;
__decorate([
    (0, common_1.Post)("policies"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateGovernanceRetentionPolicyDto]),
    __metadata("design:returntype", void 0)
], RuntimeGovernanceRetentionController.prototype, "createPolicy", null);
__decorate([
    (0, common_1.Get)("policies"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RuntimeGovernanceRetentionController.prototype, "listPolicies", null);
__decorate([
    (0, common_1.Get)("evaluations"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RuntimeGovernanceRetentionController.prototype, "listEvaluations", null);
__decorate([
    (0, common_1.Post)("policies/:id/status"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateGovernanceRetentionPolicyStatusDto]),
    __metadata("design:returntype", void 0)
], RuntimeGovernanceRetentionController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Post)("evaluate"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RuntimeGovernanceRetentionController.prototype, "evaluate", null);
exports.RuntimeGovernanceRetentionController = RuntimeGovernanceRetentionController = __decorate([
    (0, common_1.Controller)("production-hardening-v8-mega-pack-4/retention"),
    __metadata("design:paramtypes", [services_1.RuntimeGovernanceRetentionService])
], RuntimeGovernanceRetentionController);
//# sourceMappingURL=runtime-governance-retention.controller.js.map