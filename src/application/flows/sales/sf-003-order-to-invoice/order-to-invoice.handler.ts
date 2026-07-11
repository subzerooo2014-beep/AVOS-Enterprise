import { Injectable } from "@nestjs/common";
import { EventBusService } from "../../../../event-bus/event-bus.service";
import { OrderToInvoiceCommand } from "./dto/order-to-invoice.command";
import { OrderToInvoiceResponse } from "./dto/order-to-invoice.response";
import { OrderToInvoiceDomainService } from "./domain/order-to-invoice.domain-service";
import { OrderToInvoicePolicy } from "./domain/order-to-invoice.policy";
import { OrderToInvoiceRepository } from "./infrastructure/order-to-invoice.repository";

@Injectable()
export class OrderToInvoiceHandler {
  constructor(
    private readonly repository: OrderToInvoiceRepository,
    private readonly domain: OrderToInvoiceDomainService,
    private readonly policy: OrderToInvoicePolicy,
    private readonly eventBus: EventBusService,
  ) {}

  async execute(command: OrderToInvoiceCommand): Promise<OrderToInvoiceResponse> {
    const result = await this.repository.transaction(async (tx) => {
      const foundOrder = await this.repository.findOrder(tx, command.orderId);

      this.domain.ensureOrderExists(foundOrder);

      const order = foundOrder!;

      this.policy.ensureNotInvoiced(order.invoice);
      this.policy.ensureInvoiceable(order.status);

      const invoice = await this.repository.createInvoice(tx, {
        number: this.domain.createInvoiceNumber(),
        total: order.total,
        customerId: order.customerId,
        orderId: order.id,
        notes: command.notes,
      });

      await this.repository.markOrderInvoiced(tx, order.id);

      await this.repository.createAudit(tx, {
        invoiceId: invoice.id,
        customerId: order.customerId,
      });

      return {
        order,
        invoice,
      };
    });

    this.eventBus.publish("InvoiceCreated", {
      orderId: result.order.id,
      invoiceId: result.invoice.id,
      customerId: result.order.customerId,
      total: result.invoice.total,
    });

    return {
      orderId: result.order.id,
      invoiceId: result.invoice.id,
      customerId: result.order.customerId,
      invoiceNumber: result.invoice.number,
      total: result.invoice.total,
      balance: result.invoice.balance,
      status: result.invoice.status,
    };
  }
}
