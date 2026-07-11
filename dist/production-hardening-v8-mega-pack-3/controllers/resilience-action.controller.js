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
exports.ResilienceActionController = void 0;
const common_1 = require("@nestjs/common");
const dto_1 = require("../dto");
const resilience_action_service_1 = require("../services/resilience-action.service");
let ResilienceActionController = class ResilienceActionController {
    constructor(actions) {
        this.actions = actions;
    }
    create(dto) {
        return this.actions.create(dto);
    }
    list() {
        return this.actions.list();
    }
    get(id) {
        return this.actions.get(id);
    }
    approve(id, dto) {
        return this.actions.approve(id, dto);
    }
    execute(id, dto) {
        return this.actions.execute(id, dto);
    }
    cancel(id, dto) {
        return this.actions.cancel(id, dto);
    }
};
exports.ResilienceActionController = ResilienceActionController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateResilienceActionDto]),
    __metadata("design:returntype", void 0)
], ResilienceActionController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ResilienceActionController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ResilienceActionController.prototype, "get", null);
__decorate([
    (0, common_1.Post)(":id/approve"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.ExecuteResilienceActionDto]),
    __metadata("design:returntype", void 0)
], ResilienceActionController.prototype, "approve", null);
__decorate([
    (0, common_1.Post)(":id/execute"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.ExecuteResilienceActionDto]),
    __metadata("design:returntype", void 0)
], ResilienceActionController.prototype, "execute", null);
__decorate([
    (0, common_1.Post)(":id/cancel"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.ExecuteResilienceActionDto]),
    __metadata("design:returntype", void 0)
], ResilienceActionController.prototype, "cancel", null);
exports.ResilienceActionController = ResilienceActionController = __decorate([
    (0, common_1.Controller)("production-hardening-v8-mega-pack-3/actions"),
    __metadata("design:paramtypes", [resilience_action_service_1.ResilienceActionService])
], ResilienceActionController);
//# sourceMappingURL=resilience-action.controller.js.map