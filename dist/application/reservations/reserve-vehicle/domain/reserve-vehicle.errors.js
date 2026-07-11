"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleNotAvailableException = exports.InventoryNotFoundException = exports.VehicleNotFoundException = void 0;
const common_1 = require("@nestjs/common");
class VehicleNotFoundException extends common_1.NotFoundException {
    constructor() {
        super("Vehicle not found");
    }
}
exports.VehicleNotFoundException = VehicleNotFoundException;
class InventoryNotFoundException extends common_1.NotFoundException {
    constructor() {
        super("Inventory not found for this vehicle");
    }
}
exports.InventoryNotFoundException = InventoryNotFoundException;
class VehicleNotAvailableException extends common_1.BadRequestException {
    constructor() {
        super("Vehicle is not available for reservation");
    }
}
exports.VehicleNotAvailableException = VehicleNotAvailableException;
//# sourceMappingURL=reserve-vehicle.errors.js.map