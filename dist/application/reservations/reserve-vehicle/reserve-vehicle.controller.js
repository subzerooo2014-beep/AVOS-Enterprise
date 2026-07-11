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
exports.ReserveVehicleController = void 0;
const common_1 = require("@nestjs/common");
const reserve_vehicle_command_1 = require("./dto/reserve-vehicle.command");
const reserve_vehicle_handler_1 = require("./reserve-vehicle.handler");
let ReserveVehicleController = class ReserveVehicleController {
    constructor(handler) {
        this.handler = handler;
    }
    execute(command) {
        return this.handler.execute(command);
    }
};
exports.ReserveVehicleController = ReserveVehicleController;
__decorate([
    (0, common_1.Post)("reserve-vehicle"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reserve_vehicle_command_1.ReserveVehicleCommand]),
    __metadata("design:returntype", void 0)
], ReserveVehicleController.prototype, "execute", null);
exports.ReserveVehicleController = ReserveVehicleController = __decorate([
    (0, common_1.Controller)("use-cases/reservations"),
    __metadata("design:paramtypes", [reserve_vehicle_handler_1.ReserveVehicleHandler])
], ReserveVehicleController);
//# sourceMappingURL=reserve-vehicle.controller.js.map