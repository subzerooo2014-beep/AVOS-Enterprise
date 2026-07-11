"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReserveVehiclePolicy = void 0;
const common_1 = require("@nestjs/common");
const reserve_vehicle_errors_1 = require("./reserve-vehicle.errors");
let ReserveVehiclePolicy = class ReserveVehiclePolicy {
    ensureInventoryAvailable(inventory) {
        if (inventory.reserved || inventory.status !== "AVAILABLE") {
            throw new reserve_vehicle_errors_1.VehicleNotAvailableException();
        }
    }
    createExpiryDate() {
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24);
        return expiresAt;
    }
};
exports.ReserveVehiclePolicy = ReserveVehiclePolicy;
exports.ReserveVehiclePolicy = ReserveVehiclePolicy = __decorate([
    (0, common_1.Injectable)()
], ReserveVehiclePolicy);
//# sourceMappingURL=reserve-vehicle.policy.js.map