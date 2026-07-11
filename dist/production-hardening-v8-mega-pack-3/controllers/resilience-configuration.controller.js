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
exports.ResilienceConfigurationController = void 0;
const common_1 = require("@nestjs/common");
const dto_1 = require("../dto");
const resilience_configuration_service_1 = require("../services/resilience-configuration.service");
let ResilienceConfigurationController = class ResilienceConfigurationController {
    constructor(configurations) {
        this.configurations = configurations;
    }
    create(dto) {
        return this.configurations.create(dto);
    }
    list() {
        return this.configurations.list();
    }
    get(id) {
        return this.configurations.get(id);
    }
    submit(id, dto) {
        return this.configurations.submit(id, dto);
    }
    approve(id, dto) {
        return this.configurations.approve(id, dto);
    }
    activate(id, actor) {
        return this.configurations.activate(id, actor);
    }
    rollback(id, dto) {
        return this.configurations.rollback(id, dto);
    }
};
exports.ResilienceConfigurationController = ResilienceConfigurationController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateResilienceConfigurationDto]),
    __metadata("design:returntype", void 0)
], ResilienceConfigurationController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ResilienceConfigurationController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ResilienceConfigurationController.prototype, "get", null);
__decorate([
    (0, common_1.Post)(":id/submit"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.SubmitResilienceConfigurationDto]),
    __metadata("design:returntype", void 0)
], ResilienceConfigurationController.prototype, "submit", null);
__decorate([
    (0, common_1.Post)(":id/approval"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.ApproveResilienceConfigurationDto]),
    __metadata("design:returntype", void 0)
], ResilienceConfigurationController.prototype, "approve", null);
__decorate([
    (0, common_1.Post)(":id/activate"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.RuntimeActorDto]),
    __metadata("design:returntype", void 0)
], ResilienceConfigurationController.prototype, "activate", null);
__decorate([
    (0, common_1.Post)(":id/rollback"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.RollbackResilienceConfigurationDto]),
    __metadata("design:returntype", void 0)
], ResilienceConfigurationController.prototype, "rollback", null);
exports.ResilienceConfigurationController = ResilienceConfigurationController = __decorate([
    (0, common_1.Controller)("production-hardening-v8-mega-pack-3/configurations"),
    __metadata("design:paramtypes", [resilience_configuration_service_1.ResilienceConfigurationService])
], ResilienceConfigurationController);
//# sourceMappingURL=resilience-configuration.controller.js.map