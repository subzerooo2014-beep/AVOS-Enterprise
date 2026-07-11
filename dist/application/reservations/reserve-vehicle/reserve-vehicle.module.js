"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReserveVehicleModule = void 0;
const common_1 = require("@nestjs/common");
const event_bus_module_1 = require("../../../event-bus/event-bus.module");
const reserve_vehicle_controller_1 = require("./reserve-vehicle.controller");
const reserve_vehicle_handler_1 = require("./reserve-vehicle.handler");
const reserve_vehicle_policy_1 = require("./domain/reserve-vehicle.policy");
const reserve_vehicle_domain_service_1 = require("./domain/reserve-vehicle.domain-service");
const reserve_vehicle_repository_1 = require("./infrastructure/reserve-vehicle.repository");
let ReserveVehicleModule = class ReserveVehicleModule {
};
exports.ReserveVehicleModule = ReserveVehicleModule;
exports.ReserveVehicleModule = ReserveVehicleModule = __decorate([
    (0, common_1.Module)({
        imports: [event_bus_module_1.EventBusModule],
        controllers: [reserve_vehicle_controller_1.ReserveVehicleController],
        providers: [
            reserve_vehicle_handler_1.ReserveVehicleHandler,
            reserve_vehicle_policy_1.ReserveVehiclePolicy,
            reserve_vehicle_domain_service_1.ReserveVehicleDomainService,
            reserve_vehicle_repository_1.ReserveVehicleRepository,
        ],
        exports: [reserve_vehicle_handler_1.ReserveVehicleHandler],
    })
], ReserveVehicleModule);
//# sourceMappingURL=reserve-vehicle.module.js.map