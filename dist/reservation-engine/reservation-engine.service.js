"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReservationEngineService = void 0;
const common_1 = require("@nestjs/common");
let ReservationEngineService = class ReservationEngineService {
    createReservation(vehicleId, customerId) {
        const expires = new Date();
        expires.setHours(expires.getHours() + 24);
        return {
            reservationId: crypto.randomUUID(),
            vehicleId,
            customerId,
            status: "ACTIVE",
            expiresAt: expires,
        };
    }
    isExpired(expireDate) {
        return expireDate.getTime() < Date.now();
    }
};
exports.ReservationEngineService = ReservationEngineService;
exports.ReservationEngineService = ReservationEngineService = __decorate([
    (0, common_1.Injectable)()
], ReservationEngineService);
//# sourceMappingURL=reservation-engine.service.js.map