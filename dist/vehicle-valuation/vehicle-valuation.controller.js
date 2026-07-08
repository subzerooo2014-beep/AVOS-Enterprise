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
exports.VehicleValuationController = void 0;
const common_1 = require("@nestjs/common");
const vehicle_valuation_service_1 = require("./vehicle-valuation.service");
const valuate_vehicle_dto_1 = require("./dto/valuate-vehicle.dto");
let VehicleValuationController = class VehicleValuationController {
    constructor(service) {
        this.service = service;
    }
    valuate(dto) {
        return this.service.valuate(dto);
    }
};
exports.VehicleValuationController = VehicleValuationController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [valuate_vehicle_dto_1.ValuateVehicleDto]),
    __metadata("design:returntype", void 0)
], VehicleValuationController.prototype, "valuate", null);
exports.VehicleValuationController = VehicleValuationController = __decorate([
    (0, common_1.Controller)("vehicle-valuation"),
    __metadata("design:paramtypes", [vehicle_valuation_service_1.VehicleValuationService])
], VehicleValuationController);
//# sourceMappingURL=vehicle-valuation.controller.js.map