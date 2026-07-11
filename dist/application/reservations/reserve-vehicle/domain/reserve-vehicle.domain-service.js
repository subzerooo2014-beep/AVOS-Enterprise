"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReserveVehicleDomainService = void 0;
const common_1 = require("@nestjs/common");
const reserve_vehicle_errors_1 = require("./reserve-vehicle.errors");
let ReserveVehicleDomainService = class ReserveVehicleDomainService {
    ensureVehicleExists(vehicle) {
        if (!vehicle) {
            throw new reserve_vehicle_errors_1.VehicleNotFoundException();
        }
    }
    ensureInventoryExists(inventory) {
        if (!inventory) {
            throw new reserve_vehicle_errors_1.InventoryNotFoundException();
        }
    }
    ensureCanReserve(input) {
        if (input.vehicleStatus !== "AVAILABLE" ||
            input.inventoryStatus !== "AVAILABLE" ||
            input.inventoryReserved) {
            throw new reserve_vehicle_errors_1.VehicleNotAvailableException();
        }
    }
};
exports.ReserveVehicleDomainService = ReserveVehicleDomainService;
exports.ReserveVehicleDomainService = ReserveVehicleDomainService = __decorate([
    (0, common_1.Injectable)()
], ReserveVehicleDomainService);
//# sourceMappingURL=reserve-vehicle.domain-service.js.map