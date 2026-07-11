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
exports.ReputationController = void 0;
const common_1 = require("@nestjs/common");
const reputation_service_1 = require("./reputation.service");
let ReputationController = class ReputationController {
    constructor(service) {
        this.service = service;
    }
    snapshot(body) {
        return this.service.snapshot(body.entityType, body.entityId, body.metrics || {});
    }
    list() {
        return this.service.list();
    }
    timeline(entityType, entityId) {
        return this.service.timeline(entityType, entityId);
    }
};
exports.ReputationController = ReputationController;
__decorate([
    (0, common_1.Post)("snapshot"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ReputationController.prototype, "snapshot", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ReputationController.prototype, "list", null);
__decorate([
    (0, common_1.Get)("timeline/:entityType/:entityId"),
    __param(0, (0, common_1.Param)("entityType")),
    __param(1, (0, common_1.Param)("entityId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ReputationController.prototype, "timeline", null);
exports.ReputationController = ReputationController = __decorate([
    (0, common_1.Controller)("reputation"),
    __metadata("design:paramtypes", [reputation_service_1.ReputationService])
], ReputationController);
//# sourceMappingURL=reputation.controller.js.map