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
exports.RuntimeGovernanceNotificationController = void 0;
const common_1 = require("@nestjs/common");
const dto_1 = require("../dto");
const services_1 = require("../services");
let RuntimeGovernanceNotificationController = class RuntimeGovernanceNotificationController {
    constructor(notifications) {
        this.notifications = notifications;
    }
    create(dto) {
        return this.notifications
            .create(dto);
    }
    list() {
        return this.notifications.list();
    }
    get(id) {
        return this.notifications.get(id);
    }
    send(id, actor) {
        return this.notifications.send(id, actor);
    }
    delivered(id) {
        return this.notifications
            .markDelivered(id);
    }
};
exports.RuntimeGovernanceNotificationController = RuntimeGovernanceNotificationController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateGovernanceNotificationDto]),
    __metadata("design:returntype", void 0)
], RuntimeGovernanceNotificationController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RuntimeGovernanceNotificationController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RuntimeGovernanceNotificationController.prototype, "get", null);
__decorate([
    (0, common_1.Post)(":id/send"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.GovernanceActorDto]),
    __metadata("design:returntype", void 0)
], RuntimeGovernanceNotificationController.prototype, "send", null);
__decorate([
    (0, common_1.Post)(":id/delivered"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RuntimeGovernanceNotificationController.prototype, "delivered", null);
exports.RuntimeGovernanceNotificationController = RuntimeGovernanceNotificationController = __decorate([
    (0, common_1.Controller)("production-hardening-v8-mega-pack-4/notifications"),
    __metadata("design:paramtypes", [services_1.RuntimeGovernanceNotificationService])
], RuntimeGovernanceNotificationController);
//# sourceMappingURL=runtime-governance-notification.controller.js.map