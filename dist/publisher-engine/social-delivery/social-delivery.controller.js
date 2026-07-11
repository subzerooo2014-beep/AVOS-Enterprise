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
exports.SocialDeliveryController = void 0;
const common_1 = require("@nestjs/common");
const social_delivery_worker_service_1 = require("./social-delivery-worker.service");
let SocialDeliveryController = class SocialDeliveryController {
    constructor(worker) {
        this.worker = worker;
    }
    status() {
        return this.worker.status();
    }
    credentials() {
        return this.worker.credentialsReadiness();
    }
    queue(limit) {
        return this.worker.queue(limit
            ? Number(limit)
            : 50);
    }
    run(limit) {
        return this.worker.runOnce(limit
            ? Number(limit)
            : 10);
    }
    requeue(channel) {
        return this.worker.requeueAwaitingCredentials(channel);
    }
    requeueAndRun(channel, limit) {
        return this.worker.requeueAndRun(channel, limit
            ? Number(limit)
            : 10);
    }
    processEvent(id) {
        return this.worker.processById(id);
    }
};
exports.SocialDeliveryController = SocialDeliveryController;
__decorate([
    (0, common_1.Get)("status"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SocialDeliveryController.prototype, "status", null);
__decorate([
    (0, common_1.Get)("credentials"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SocialDeliveryController.prototype, "credentials", null);
__decorate([
    (0, common_1.Get)("queue"),
    __param(0, (0, common_1.Query)("limit")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SocialDeliveryController.prototype, "queue", null);
__decorate([
    (0, common_1.Post)("run"),
    __param(0, (0, common_1.Query)("limit")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SocialDeliveryController.prototype, "run", null);
__decorate([
    (0, common_1.Post)("requeue"),
    __param(0, (0, common_1.Query)("channel")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SocialDeliveryController.prototype, "requeue", null);
__decorate([
    (0, common_1.Post)("requeue-run"),
    __param(0, (0, common_1.Query)("channel")),
    __param(1, (0, common_1.Query)("limit")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], SocialDeliveryController.prototype, "requeueAndRun", null);
__decorate([
    (0, common_1.Post)("event/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SocialDeliveryController.prototype, "processEvent", null);
exports.SocialDeliveryController = SocialDeliveryController = __decorate([
    (0, common_1.Controller)("publisher-engine/social-delivery"),
    __metadata("design:paramtypes", [social_delivery_worker_service_1.SocialDeliveryWorkerService])
], SocialDeliveryController);
//# sourceMappingURL=social-delivery.controller.js.map