import { EventBusService } from "../../../../event-bus/event-bus.service";
import { OrderToInvoiceCommand } from "./dto/order-to-invoice.command";
import { OrderToInvoiceResponse } from "./dto/order-to-invoice.response";
import { OrderToInvoiceDomainService } from "./domain/order-to-invoice.domain-service";
import { OrderToInvoicePolicy } from "./domain/order-to-invoice.policy";
import { OrderToInvoiceRepository } from "./infrastructure/order-to-invoice.repository";
export declare class OrderToInvoiceHandler {
    private readonly repository;
    private readonly domain;
    private readonly policy;
    private readonly eventBus;
    constructor(repository: OrderToInvoiceRepository, domain: OrderToInvoiceDomainService, policy: OrderToInvoicePolicy, eventBus: EventBusService);
    execute(command: OrderToInvoiceCommand): Promise<OrderToInvoiceResponse>;
}
