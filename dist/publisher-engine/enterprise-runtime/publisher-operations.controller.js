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
exports.PublisherOperationsController = void 0;
const common_1 = require("@nestjs/common");
const publisher_operations_service_1 = require("./publisher-operations.service");
let PublisherOperationsController = class PublisherOperationsController {
    constructor(service) {
        this.service = service;
    }
    cancel(eventId, body) {
        return this.service.cancel(eventId, body?.reason);
    }
    retry(eventId, body) {
        return this.service.retry(eventId, body?.reason);
    }
    retryNow(eventId, body) {
        return this.service.retryNow(eventId, body?.reason);
    }
    clone(eventId, body) {
        return this.service.clone(eventId, body);
    }
    replay(eventId, body) {
        return this.service.replay(eventId, body);
    }
    history(eventId) {
        return this.service.operationHistory(eventId);
    }
};
exports.PublisherOperationsController = PublisherOperationsController;
__decorate([
    (0, common_1.Post)("cancel/:eventId"),
    __param(0, (0, common_1.Param)("eventId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PublisherOperationsController.prototype, "cancel", null);
__decorate([
    (0, common_1.Post)("retry/:eventId"),
    __param(0, (0, common_1.Param)("eventId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PublisherOperationsController.prototype, "retry", null);
__decorate([
    (0, common_1.Post)("retry-now/:eventId"),
    __param(0, (0, common_1.Param)("eventId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PublisherOperationsController.prototype, "retryNow", null);
__decorate([
    (0, common_1.Post)("clone/:eventId"),
    __param(0, (0, common_1.Param)("eventId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PublisherOperationsController.prototype, "clone", null);
__decorate([
    (0, common_1.Post)("replay/:eventId"),
    __param(0, (0, common_1.Param)("eventId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PublisherOperationsController.prototype, "replay", null);
__decorate([
    (0, common_1.Get)("history/:eventId"),
    __param(0, (0, common_1.Param)("eventId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PublisherOperationsController.prototype, "history", null);
exports.PublisherOperationsController = PublisherOperationsController = __decorate([
    (0, common_1.Controller)("publisher-engine/enterprise/operations"),
    __metadata("design:paramtypes", [publisher_operations_service_1.PublisherOperationsService])
], PublisherOperationsController);
//# sourceMappingURL=publisher-operations.controller.js.map