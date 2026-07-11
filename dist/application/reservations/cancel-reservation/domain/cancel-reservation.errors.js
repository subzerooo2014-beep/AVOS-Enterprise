"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReservationAlreadyClosedException = exports.ReservationNotFoundException = void 0;
const common_1 = require("@nestjs/common");
class ReservationNotFoundException extends common_1.NotFoundException {
    constructor() {
        super("Reservation not found");
    }
}
exports.ReservationNotFoundException = ReservationNotFoundException;
class ReservationAlreadyClosedException extends common_1.BadRequestException {
    constructor() {
        super("Reservation already closed");
    }
}
exports.ReservationAlreadyClosedException = ReservationAlreadyClosedException;
//# sourceMappingURL=cancel-reservation.errors.js.map