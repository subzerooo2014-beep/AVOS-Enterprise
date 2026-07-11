import { EventBusService } from "../../../../event-bus/event-bus.service";
import { QuoteToSalesOrderCommand } from "./dto/quote-to-sales-order.command";
import { QuoteToSalesOrderResponse } from "./dto/quote-to-sales-order.response";
import { QuoteToSalesOrderDomainService } from "./domain/quote-to-sales-order.domain-service";
import { QuoteToSalesOrderPolicy } from "./domain/quote-to-sales-order.policy";
import { QuoteToSalesOrderRepository } from "./infrastructure/quote-to-sales-order.repository";
export declare class QuoteToSalesOrderHandler {
    private readonly repository;
    private readonly domain;
    private readonly policy;
    private readonly eventBus;
    constructor(repository: QuoteToSalesOrderRepository, domain: QuoteToSalesOrderDomainService, policy: QuoteToSalesOrderPolicy, eventBus: EventBusService);
    execute(command: QuoteToSalesOrderCommand): Promise<QuoteToSalesOrderResponse>;
}
