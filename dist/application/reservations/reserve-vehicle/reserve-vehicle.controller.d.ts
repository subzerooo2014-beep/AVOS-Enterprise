import { ReserveVehicleCommand } from "./dto/reserve-vehicle.command";
import { ReserveVehicleHandler } from "./reserve-vehicle.handler";
export declare class ReserveVehicleController {
    private readonly handler;
    constructor(handler: ReserveVehicleHandler);
    execute(command: ReserveVehicleCommand): Promise<import("./dto/reserve-vehicle.response").ReserveVehicleResponse>;
}
