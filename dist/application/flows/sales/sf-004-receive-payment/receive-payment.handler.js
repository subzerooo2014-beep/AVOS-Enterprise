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
exports.ReceivePaymentHandler = void 0;
const common_1 = require("@nestjs/common");
const event_bus_service_1 = require("../../../../event-bus/event-bus.service");
const receive_payment_domain_service_1 = require("./domain/receive-payment.domain-service");
const receive_payment_policy_1 = require("./domain/receive-payment.policy");
const receive_payment_repository_1 = require("./infrastructure/receive-payment.repository");
let ReceivePaymentHandler = class ReceivePaymentHandler {
    constructor(repository, domain, policy, eventBus) {
        this.repository = repository;
        this.domain = domain;
        this.policy = policy;
        this.eventBus = eventBus;
    }
    async execute(command) {
        const result = await this.repository.transaction(async (tx) => {
            const foundInvoice = await this.repository.findInvoice(tx, command.invoiceId);
            this.domain.ensureInvoiceExists(foundInvoice);
            const invoice = foundInvoice;
            this.policy.ensureInvoicePayable({
                status: invoice.status,
                balance: invoice.balance,
            });
            this.policy.ensureValidAmount(command.amount, invoice.balance);
            const nextState = this.policy.calculateAfterPayment({
                paidAmount: invoice.paidAmount,
                balance: invoice.balance,
            }, command.amount);
            const payment = await this.repository.createPayment(tx, {
                invoiceId: invoice.id,
                orderId: invoice.orderId,
                customerId: invoice.customerId,
                amount: command.amount,
                method: command.method,
                reference: command.reference,
                notes: command.notes,
            });
            const updatedInvoice = await this.repository.updateInvoicePaymentState(tx, {
                invoiceId: invoice.id,
                paidAmount: nextState.paidAmount,
                balance: nextState.balance,
                status: nextState.status,
            });
            await this.repository.createAudit(tx, {
                paymentId: payment.id,
                invoiceId: invoice.id,
                customerId: invoice.customerId,
            });
            return {
                payment,
                invoice: updatedInvoice,
            };
        });
        this.eventBus.publish("PaymentReceived", {
            paymentId: result.payment.id,
            invoiceId: result.invoice.id,
            amount: result.payment.amount,
            status: result.invoice.status,
        });
        return {
            invoiceId: result.invoice.id,
            paymentId: result.payment.id,
            amount: result.payment.amount,
            invoiceStatus: result.invoice.status,
            paidAmount: result.invoice.paidAmount,
            balance: result.invoice.balance,
        };
    }
};
exports.ReceivePaymentHandler = ReceivePaymentHandler;
exports.ReceivePaymentHandler = ReceivePaymentHandler = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [receive_payment_repository_1.ReceivePaymentRepository,
        receive_payment_domain_service_1.ReceivePaymentDomainService,
        receive_payment_policy_1.ReceivePaymentPolicy,
        event_bus_service_1.EventBusService])
], ReceivePaymentHandler);
//# sourceMappingURL=receive-payment.handler.js.map