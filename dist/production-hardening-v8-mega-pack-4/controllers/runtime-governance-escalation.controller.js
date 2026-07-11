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
exports.RuntimeGovernanceEscalationController = void 0;
const common_1 = require("@nestjs/common");
const dto_1 = require("../dto");
const services_1 = require("../services");
let RuntimeGovernanceEscalationController = class RuntimeGovernanceEscalationController {
    constructor(escalations) {
        this.escalations = escalations;
    }
    create(dto) {
        return this.escalations.create(dto);
    }
    list() {
        return this.escalations.list();
    }
    get(id) {
        return this.escalations.get(id);
    }
    update(id, dto) {
        return this.escalations.update(id, dto);
    }
    createNotification(id, actor) {
        return this.escalations
            .createNotification(id, actor);
    }
};
exports.RuntimeGovernanceEscalationController = RuntimeGovernanceEscalationController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateGovernanceEscalationDto]),
    __metadata("design:returntype", void 0)
], RuntimeGovernanceEscalationController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RuntimeGovernanceEscalationController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RuntimeGovernanceEscalationController.prototype, "get", null);
__decorate([
    (0, common_1.Post)(":id/update"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateGovernanceEscalationDto]),
    __metadata("design:returntype", void 0)
], RuntimeGovernanceEscalationController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(":id/notification"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.GovernanceActorDto]),
    __metadata("design:returntype", void 0)
], RuntimeGovernanceEscalationController.prototype, "createNotification", null);
exports.RuntimeGovernanceEscalationController = RuntimeGovernanceEscalationController = __decorate([
    (0, common_1.Controller)("production-hardening-v8-mega-pack-4/escalations"),
    __metadata("design:paramtypes", [services_1.RuntimeGovernanceEscalationService])
], RuntimeGovernanceEscalationController);
//# sourceMappingURL=runtime-governance-escalation.controller.js.map