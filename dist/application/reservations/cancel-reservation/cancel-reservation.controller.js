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
exports.CancelReservationController = void 0;
const common_1 = require("@nestjs/common");
const cancel_reservation_command_1 = require("./dto/cancel-reservation.command");
const cancel_reservation_handler_1 = require("./cancel-reservation.handler");
let CancelReservationController = class CancelReservationController {
    constructor(handler) {
        this.handler = handler;
    }
    execute(command) {
        return this.handler.execute(command);
    }
};
exports.CancelReservationController = CancelReservationController;
__decorate([
    (0, common_1.Post)("cancel-reservation"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [cancel_reservation_command_1.CancelReservationCommand]),
    __metadata("design:returntype", void 0)
], CancelReservationController.prototype, "execute", null);
exports.CancelReservationController = CancelReservationController = __decorate([
    (0, common_1.Controller)("use-cases/reservations"),
    __metadata("design:paramtypes", [cancel_reservation_handler_1.CancelReservationHandler])
], CancelReservationController);
//# sourceMappingURL=cancel-reservation.controller.js.map