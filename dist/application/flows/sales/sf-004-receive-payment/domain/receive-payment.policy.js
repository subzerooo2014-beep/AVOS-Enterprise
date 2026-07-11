"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReceivePaymentPolicy = void 0;
const common_1 = require("@nestjs/common");
const receive_payment_errors_1 = require("./receive-payment.errors");
let ReceivePaymentPolicy = class ReceivePaymentPolicy {
    ensureInvoicePayable(invoice) {
        if (invoice.status === "PAID" || invoice.balance <= 0) {
            throw new receive_payment_errors_1.InvoiceAlreadyPaidException();
        }
    }
    ensureValidAmount(amount, balance) {
        if (amount <= 0 || amount > balance) {
            throw new receive_payment_errors_1.InvalidPaymentAmountException();
        }
    }
    calculateAfterPayment(invoice, amount) {
        const paidAmount = invoice.paidAmount + amount;
        const balance = invoice.balance - amount;
        const status = balance <= 0 ? "PAID" : "PARTIALLY_PAID";
        return {
            paidAmount,
            balance,
            status,
        };
    }
};
exports.ReceivePaymentPolicy = ReceivePaymentPolicy;
exports.ReceivePaymentPolicy = ReceivePaymentPolicy = __decorate([
    (0, common_1.Injectable)()
], ReceivePaymentPolicy);
//# sourceMappingURL=receive-payment.policy.js.map