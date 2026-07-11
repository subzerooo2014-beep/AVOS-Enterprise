import { Body, Controller, Post } from "@nestjs/common";
import { OrderToInvoiceCommand } from "./dto/order-to-invoice.command";
import { OrderToInvoiceHandler } from "./order-to-invoice.handler";

@Controller("flows/sales")
export class OrderToInvoiceController {
  constructor(private readonly handler: OrderToInvoiceHandler) {}

  @Post("order-to-invoice")
  execute(@Body() command: OrderToInvoiceCommand) {
    return this.handler.execute(command);
  }
}
