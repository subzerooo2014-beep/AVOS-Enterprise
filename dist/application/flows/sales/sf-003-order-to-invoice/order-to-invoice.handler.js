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
exports.OrderToInvoiceHandler = void 0;
const common_1 = require("@nestjs/common");
const event_bus_service_1 = require("../../../../event-bus/event-bus.service");
const order_to_invoice_domain_service_1 = require("./domain/order-to-invoice.domain-service");
const order_to_invoice_policy_1 = require("./domain/order-to-invoice.policy");
const order_to_invoice_repository_1 = require("./infrastructure/order-to-invoice.repository");
let OrderToInvoiceHandler = class OrderToInvoiceHandler {
    constructor(repository, domain, policy, eventBus) {
        this.repository = repository;
        this.domain = domain;
        this.policy = policy;
        this.eventBus = eventBus;
    }
    async execute(command) {
        const result = await this.repository.transaction(async (tx) => {
            const foundOrder = await this.repository.findOrder(tx, command.orderId);
            this.domain.ensureOrderExists(foundOrder);
            const order = foundOrder;
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
};
exports.OrderToInvoiceHandler = OrderToInvoiceHandler;
exports.OrderToInvoiceHandler = OrderToInvoiceHandler = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [order_to_invoice_repository_1.OrderToInvoiceRepository,
        order_to_invoice_domain_service_1.OrderToInvoiceDomainService,
        order_to_invoice_policy_1.OrderToInvoicePolicy,
        event_bus_service_1.EventBusService])
], OrderToInvoiceHandler);
//# sourceMappingURL=order-to-invoice.handler.js.map