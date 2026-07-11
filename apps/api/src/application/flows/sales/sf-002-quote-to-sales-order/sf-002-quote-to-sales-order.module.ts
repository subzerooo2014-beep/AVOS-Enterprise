import { Module } from "@nestjs/common";
import { EventBusModule } from "../../../../event-bus/event-bus.module";
import { QuoteToSalesOrderController } from "./quote-to-sales-order.controller";
import { QuoteToSalesOrderHandler } from "./quote-to-sales-order.handler";
import { QuoteToSalesOrderDomainService } from "./domain/quote-to-sales-order.domain-service";
import { QuoteToSalesOrderPolicy } from "./domain/quote-to-sales-order.policy";
import { QuoteToSalesOrderRepository } from "./infrastructure/quote-to-sales-order.repository";

@Module({
  imports: [EventBusModule],
  controllers: [QuoteToSalesOrderController],
  providers: [
    QuoteToSalesOrderHandler,
    QuoteToSalesOrderDomainService,
    QuoteToSalesOrderPolicy,
    QuoteToSalesOrderRepository,
  ],
  exports: [QuoteToSalesOrderHandler],
})
export class Sf002QuoteToSalesOrderModule {}
