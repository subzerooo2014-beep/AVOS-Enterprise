import { Body, Controller, Post } from "@nestjs/common";
import { CancelReservationCommand } from "./dto/cancel-reservation.command";
import { CancelReservationHandler } from "./cancel-reservation.handler";

@Controller("use-cases/reservations")
export class CancelReservationController {

  constructor(
    private readonly handler:CancelReservationHandler
  ){}

  @Post("cancel-reservation")
  execute(
    @Body() command:CancelReservationCommand
  ){
    return this.handler.execute(command);
  }

}
