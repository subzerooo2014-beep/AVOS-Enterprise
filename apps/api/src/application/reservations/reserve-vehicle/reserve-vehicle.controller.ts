import { Body, Controller, Post } from "@nestjs/common";
import { ReserveVehicleCommand } from "./dto/reserve-vehicle.command";
import { ReserveVehicleHandler } from "./reserve-vehicle.handler";

@Controller("use-cases/reservations")
export class ReserveVehicleController {
  constructor(private readonly handler: ReserveVehicleHandler) {}

  @Post("reserve-vehicle")
  execute(@Body() command: ReserveVehicleCommand) {
    return this.handler.execute(command);
  }
}
