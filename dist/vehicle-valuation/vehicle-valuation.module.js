"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleValuationModule = void 0;
const common_1 = require("@nestjs/common");
const vehicle_valuation_controller_1 = require("./vehicle-valuation.controller");
const vehicle_valuation_service_1 = require("./vehicle-valuation.service");
let VehicleValuationModule = class VehicleValuationModule {
};
exports.VehicleValuationModule = VehicleValuationModule;
exports.VehicleValuationModule = VehicleValuationModule = __decorate([
    (0, common_1.Module)({
        controllers: [vehicle_valuation_controller_1.VehicleValuationController],
        providers: [vehicle_valuation_service_1.VehicleValuationService],
    })
], VehicleValuationModule);
//# sourceMappingURL=vehicle-valuation.module.js.map