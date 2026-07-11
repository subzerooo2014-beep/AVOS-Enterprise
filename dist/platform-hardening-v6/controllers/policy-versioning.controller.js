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
exports.PolicyVersioningController = void 0;
const common_1 = require("@nestjs/common");
const create_versioned_policy_dto_1 = require("../dto/create-versioned-policy.dto");
const rollback_policy_dto_1 = require("../dto/rollback-policy.dto");
const update_versioned_policy_dto_1 = require("../dto/update-versioned-policy.dto");
const policy_versioning_service_1 = require("../services/policy-versioning.service");
const v6_diagnostics_token_guard_1 = require("../services/v6-diagnostics-token.guard");
let PolicyVersioningController = class PolicyVersioningController {
    constructor(policies) {
        this.policies = policies;
    }
    async findAll() {
        return {
            success: true,
            summary: await this.policies.getSummary(),
            policies: await this.policies.findAll(),
        };
    }
    async findOne(id) {
        return {
            success: true,
            policy: await this.policies.findOne(id),
        };
    }
    async history(id, limit) {
        return {
            success: true,
            versions: await this.policies.history(id, Number(limit) || 100),
        };
    }
    async compare(id, fromVersion, toVersion) {
        return {
            success: true,
            comparison: await this.policies.compare(id, fromVersion, toVersion),
        };
    }
    async create(dto, request) {
        return {
            success: true,
            result: await this.policies.create(dto, this.getContext(request)),
        };
    }
    async update(id, dto, request) {
        return {
            success: true,
            result: await this.policies.update(id, dto, this.getContext(request)),
        };
    }
    async rollback(id, dto, request) {
        return {
            success: true,
            result: await this.policies.rollback(id, dto, this.getContext(request)),
        };
    }
    getContext(request) {
        return {
            correlationId: request.headers?.["x-correlation-id"],
            traceId: request.headers?.["x-trace-id"],
            actor: request.headers?.["x-avos-actor"] ??
                "platform-owner",
        };
    }
};
exports.PolicyVersioningController = PolicyVersioningController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PolicyVersioningController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PolicyVersioningController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(":id/history"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Query)("limit")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PolicyVersioningController.prototype, "history", null);
__decorate([
    (0, common_1.Get)(":id/compare/:from/:to"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Param)("from", common_1.ParseIntPipe)),
    __param(2, (0, common_1.Param)("to", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], PolicyVersioningController.prototype, "compare", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_versioned_policy_dto_1.CreateVersionedPolicyDto, Object]),
    __metadata("design:returntype", Promise)
], PolicyVersioningController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_versioned_policy_dto_1.UpdateVersionedPolicyDto, Object]),
    __metadata("design:returntype", Promise)
], PolicyVersioningController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(":id/rollback"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, rollback_policy_dto_1.RollbackPolicyDto, Object]),
    __metadata("design:returntype", Promise)
], PolicyVersioningController.prototype, "rollback", null);
exports.PolicyVersioningController = PolicyVersioningController = __decorate([
    (0, common_1.Controller)("platform-hardening/v6/policies"),
    (0, common_1.UseGuards)(v6_diagnostics_token_guard_1.V6DiagnosticsTokenGuard),
    __metadata("design:paramtypes", [policy_versioning_service_1.PolicyVersioningService])
], PolicyVersioningController);
//# sourceMappingURL=policy-versioning.controller.js.map