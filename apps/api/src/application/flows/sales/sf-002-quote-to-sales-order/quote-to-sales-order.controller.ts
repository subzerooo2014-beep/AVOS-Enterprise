import { Body, Controller, Post } from "@nestjs/common";
import { QuoteToSalesOrderCommand } from "./dto/quote-to-sales-order.command";
import { QuoteToSalesOrderHandler } from "./quote-to-sales-order.handler";

@Controller("flows/sales")
export class QuoteToSalesOrderController {
  constructor(private readonly handler: QuoteToSalesOrderHandler) {}

  @Post("quote-to-sales-order")
  execute(@Body() command: QuoteToSalesOrderCommand) {
    return this.handler.execute(command);
  }
}
