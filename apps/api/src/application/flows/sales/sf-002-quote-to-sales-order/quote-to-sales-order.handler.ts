import { Injectable } from "@nestjs/common";
import { EventBusService } from "../../../../event-bus/event-bus.service";
import { QuoteToSalesOrderCommand } from "./dto/quote-to-sales-order.command";
import { QuoteToSalesOrderResponse } from "./dto/quote-to-sales-order.response";
import { QuoteToSalesOrderDomainService } from "./domain/quote-to-sales-order.domain-service";
import { QuoteToSalesOrderPolicy } from "./domain/quote-to-sales-order.policy";
import { QuoteToSalesOrderRepository } from "./infrastructure/quote-to-sales-order.repository";

@Injectable()
export class QuoteToSalesOrderHandler {
  constructor(
    private readonly repository: QuoteToSalesOrderRepository,
    private readonly domain: QuoteToSalesOrderDomainService,
    private readonly policy: QuoteToSalesOrderPolicy,
    private readonly eventBus: EventBusService,
  ) {}

  async execute(command: QuoteToSalesOrderCommand): Promise<QuoteToSalesOrderResponse> {
    const result = await this.repository.transaction(async (tx) => {
      const quote = await this.repository.findQuote(tx, command.quoteId);

      this.domain.ensureQuoteExists(quote);
      this.policy.ensureHasCustomer(quote!.customerId);
      this.policy.ensureNotConverted(quote!.order);
      this.policy.ensureConvertible(quote!.status);

      const customerId = quote!.customerId!;
      const totalAmount = quote!.total ?? 0;

      const salesOrder = await this.repository.createSalesOrder(tx, {
        customerId,
        totalAmount,
      });

      await this.repository.createLegacyOrder(tx, {
        quoteId: quote!.id,
        customerId,
        total: totalAmount,
        notes: command.notes,
      });

      await this.repository.markQuoteApproved(tx, quote!.id);

      await this.repository.createAudit(tx, {
        quoteId: quote!.id,
        salesOrderId: salesOrder.id,
        customerId,
      });

      return {
        quoteId: quote!.id,
        customerId,
        salesOrder,
      };
    });

    this.eventBus.publish("QuoteConvertedToSalesOrder", {
      quoteId: result.quoteId,
      salesOrderId: result.salesOrder.id,
      customerId: result.customerId,
      totalAmount: result.salesOrder.totalAmount,
    });

    return {
      quoteId: result.quoteId,
      salesOrderId: result.salesOrder.id,
      customerId: result.customerId,
      status: result.salesOrder.status,
      totalAmount: result.salesOrder.totalAmount,
    };
  }
}
