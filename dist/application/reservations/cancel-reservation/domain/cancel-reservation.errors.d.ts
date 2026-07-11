import { BadRequestException, NotFoundException } from "@nestjs/common";
export declare class ReservationNotFoundException extends NotFoundException {
    constructor();
}
export declare class ReservationAlreadyClosedException extends BadRequestException {
    constructor();
}
