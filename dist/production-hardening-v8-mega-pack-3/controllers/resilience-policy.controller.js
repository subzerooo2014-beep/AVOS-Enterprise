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
exports.ResiliencePolicyController = void 0;
const common_1 = require("@nestjs/common");
const dto_1 = require("../dto");
const resilience_policy_service_1 = require("../services/resilience-policy.service");
let ResiliencePolicyController = class ResiliencePolicyController {
    constructor(policies) {
        this.policies = policies;
    }
    create(dto) {
        return this.policies.create(dto);
    }
    list() {
        return this.policies.list();
    }
    get(id) {
        return this.policies.get(id);
    }
    activate(id, actor) {
        return this.policies.activate(id, actor);
    }
    disable(id, actor) {
        return this.policies.disable(id, actor);
    }
};
exports.ResiliencePolicyController = ResiliencePolicyController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateResiliencePolicyDto]),
    __metadata("design:returntype", void 0)
], ResiliencePolicyController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ResiliencePolicyController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ResiliencePolicyController.prototype, "get", null);
__decorate([
    (0, common_1.Post)(":id/activate"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.RuntimeActorDto]),
    __metadata("design:returntype", void 0)
], ResiliencePolicyController.prototype, "activate", null);
__decorate([
    (0, common_1.Post)(":id/disable"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.RuntimeActorDto]),
    __metadata("design:returntype", void 0)
], ResiliencePolicyController.prototype, "disable", null);
exports.ResiliencePolicyController = ResiliencePolicyController = __decorate([
    (0, common_1.Controller)("production-hardening-v8-mega-pack-3/policies"),
    __metadata("design:paramtypes", [resilience_policy_service_1.ResiliencePolicyService])
], ResiliencePolicyController);
//# sourceMappingURL=resilience-policy.controller.js.map