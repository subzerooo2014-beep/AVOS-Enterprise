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
exports.AvosBrainController = void 0;
const common_1 = require("@nestjs/common");
const avos_brain_service_1 = require("./avos-brain.service");
let AvosBrainController = class AvosBrainController {
    constructor(service) {
        this.service = service;
    }
    processEvent(eventId) {
        return this.service.processEvent(eventId);
    }
    processLatest(body) {
        return this.service.processLatest(body.limit || 10);
    }
    listTasks(status) {
        return this.service.listTasks(status);
    }
    complete(id, body) {
        return this.service.completeTask(id, body);
    }
};
exports.AvosBrainController = AvosBrainController;
__decorate([
    (0, common_1.Post)("process-event/:eventId"),
    __param(0, (0, common_1.Param)("eventId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AvosBrainController.prototype, "processEvent", null);
__decorate([
    (0, common_1.Post)("process-latest"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AvosBrainController.prototype, "processLatest", null);
__decorate([
    (0, common_1.Get)("tasks"),
    __param(0, (0, common_1.Query)("status")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AvosBrainController.prototype, "listTasks", null);
__decorate([
    (0, common_1.Patch)("tasks/:id/complete"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AvosBrainController.prototype, "complete", null);
exports.AvosBrainController = AvosBrainController = __decorate([
    (0, common_1.Controller)("avos-brain"),
    __metadata("design:paramtypes", [avos_brain_service_1.AvosBrainService])
], AvosBrainController);
//# sourceMappingURL=avos-brain.controller.js.map