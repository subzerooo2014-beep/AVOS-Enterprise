import { Body, Controller, Post } from "@nestjs/common";
import { ReceivePaymentCommand } from "./dto/receive-payment.command";
import { ReceivePaymentHandler } from "./receive-payment.handler";

@Controller("flows/sales")
export class ReceivePaymentController {
  constructor(private readonly handler: ReceivePaymentHandler) {}

  @Post("receive-payment")
  execute(@Body() command: ReceivePaymentCommand) {
    return this.handler.execute(command);
  }
}
