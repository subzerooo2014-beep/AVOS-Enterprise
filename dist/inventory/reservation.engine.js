"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReservationEngine = void 0;
class ReservationEngine {
    reserve(id) {
        return {
            vehicleId: id,
            reserved: true,
        };
    }
    release(id) {
        return {
            vehicleId: id,
            reserved: false,
        };
    }
}
exports.ReservationEngine = ReservationEngine;
//# sourceMappingURL=reservation.engine.js.map