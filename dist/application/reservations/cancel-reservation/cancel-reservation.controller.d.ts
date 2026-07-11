import { CancelReservationCommand } from "./dto/cancel-reservation.command";
import { CancelReservationHandler } from "./cancel-reservation.handler";
export declare class CancelReservationController {
    private readonly handler;
    constructor(handler: CancelReservationHandler);
    execute(command: CancelReservationCommand): Promise<import("./dto/cancel-reservation.response").CancelReservationResponse>;
}
