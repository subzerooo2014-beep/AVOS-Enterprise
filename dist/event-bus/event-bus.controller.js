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
exports.EventBusController = void 0;
const common_1 = require("@nestjs/common");
const event_bus_service_1 = require("./event-bus.service");
let EventBusController = class EventBusController {
    constructor(service) {
        this.service = service;
    }
    emit(body) {
        return this.service.emit(body);
    }
    list(status) {
        return this.service.list(status);
    }
    processed(id, body) {
        return this.service.markProcessed(id, body);
    }
};
exports.EventBusController = EventBusController;
__decorate([
    (0, common_1.Post)("emit"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], EventBusController.prototype, "emit", null);
__decorate([
    (0, common_1.Get)("events"),
    __param(0, (0, common_1.Query)("status")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EventBusController.prototype, "list", null);
__decorate([
    (0, common_1.Patch)("events/:id/processed"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], EventBusController.prototype, "processed", null);
exports.EventBusController = EventBusController = __decorate([
    (0, common_1.Controller)("event-bus"),
    __metadata("design:paramtypes", [event_bus_service_1.EventBusService])
], EventBusController);
//# sourceMappingURL=event-bus.controller.js.map