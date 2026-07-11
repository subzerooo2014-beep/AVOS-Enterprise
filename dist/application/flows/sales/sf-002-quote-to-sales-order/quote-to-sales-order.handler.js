"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuoteToSalesOrderHandler = void 0;
const common_1 = require("@nestjs/common");
const event_bus_service_1 = require("../../../../event-bus/event-bus.service");
const quote_to_sales_order_domain_service_1 = require("./domain/quote-to-sales-order.domain-service");
const quote_to_sales_order_policy_1 = require("./domain/quote-to-sales-order.policy");
const quote_to_sales_order_repository_1 = require("./infrastructure/quote-to-sales-order.repository");
let QuoteToSalesOrderHandler = class QuoteToSalesOrderHandler {
    constructor(repository, domain, policy, eventBus) {
        this.repository = repository;
        this.domain = domain;
        this.policy = policy;
        this.eventBus = eventBus;
    }
    async execute(command) {
        const result = await this.repository.transaction(async (tx) => {
            const quote = await this.repository.findQuote(tx, command.quoteId);
            this.domain.ensureQuoteExists(quote);
            this.policy.ensureHasCustomer(quote.customerId);
            this.policy.ensureNotConverted(quote.order);
            this.policy.ensureConvertible(quote.status);
            const customerId = quote.customerId;
            const totalAmount = quote.total ?? 0;
            const salesOrder = await this.repository.createSalesOrder(tx, {
                customerId,
                totalAmount,
            });
            await this.repository.createLegacyOrder(tx, {
                quoteId: quote.id,
                customerId,
                total: totalAmount,
                notes: command.notes,
            });
            await this.repository.markQuoteApproved(tx, quote.id);
            await this.repository.createAudit(tx, {
                quoteId: quote.id,
                salesOrderId: salesOrder.id,
                customerId,
            });
            return {
                quoteId: quote.id,
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
};
exports.QuoteToSalesOrderHandler = QuoteToSalesOrderHandler;
exports.QuoteToSalesOrderHandler = QuoteToSalesOrderHandler = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [quote_to_sales_order_repository_1.QuoteToSalesOrderRepository,
        quote_to_sales_order_domain_service_1.QuoteToSalesOrderDomainService,
        quote_to_sales_order_policy_1.QuoteToSalesOrderPolicy,
        event_bus_service_1.EventBusService])
], QuoteToSalesOrderHandler);
//# sourceMappingURL=quote-to-sales-order.handler.js.map