"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleIntelligenceModule = void 0;
const common_1 = require("@nestjs/common");
const vehicle_intelligence_controller_1 = require("./vehicle-intelligence.controller");
const vehicle_intelligence_service_1 = require("./vehicle-intelligence.service");
let VehicleIntelligenceModule = class VehicleIntelligenceModule {
};
exports.VehicleIntelligenceModule = VehicleIntelligenceModule;
exports.VehicleIntelligenceModule = VehicleIntelligenceModule = __decorate([
    (0, common_1.Module)({
        controllers: [vehicle_intelligence_controller_1.VehicleIntelligenceController],
        providers: [vehicle_intelligence_service_1.VehicleIntelligenceService],
        exports: [vehicle_intelligence_service_1.VehicleIntelligenceService],
    })
], VehicleIntelligenceModule);
//# sourceMappingURL=vehicle-intelligence.module.js.map