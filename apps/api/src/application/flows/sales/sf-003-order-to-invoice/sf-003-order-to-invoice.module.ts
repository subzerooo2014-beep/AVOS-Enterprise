import { Module } from "@nestjs/common";
import { EventBusModule } from "../../../../event-bus/event-bus.module";
import { OrderToInvoiceController } from "./order-to-invoice.controller";
import { OrderToInvoiceHandler } from "./order-to-invoice.handler";
import { OrderToInvoiceDomainService } from "./domain/order-to-invoice.domain-service";
import { OrderToInvoicePolicy } from "./domain/order-to-invoice.policy";
import { OrderToInvoiceRepository } from "./infrastructure/order-to-invoice.repository";

@Module({
  imports: [EventBusModule],
  controllers: [OrderToInvoiceController],
  providers: [
    OrderToInvoiceHandler,
    OrderToInvoiceDomainService,
    OrderToInvoicePolicy,
    OrderToInvoiceRepository,
  ],
  exports: [OrderToInvoiceHandler],
})
export class Sf003OrderToInvoiceModule {}
