"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderToInvoicePolicy = void 0;
const common_1 = require("@nestjs/common");
const order_to_invoice_errors_1 = require("./order-to-invoice.errors");
let OrderToInvoicePolicy = class OrderToInvoicePolicy {
    ensureNotInvoiced(invoice) {
        if (invoice) {
            throw new order_to_invoice_errors_1.OrderAlreadyInvoicedException();
        }
    }
    ensureInvoiceable(status) {
        if (status === "CANCELLED" || status === "VOID") {
            throw new order_to_invoice_errors_1.OrderNotInvoiceableException();
        }
    }
};
exports.OrderToInvoicePolicy = OrderToInvoicePolicy;
exports.OrderToInvoicePolicy = OrderToInvoicePolicy = __decorate([
    (0, common_1.Injectable)()
], OrderToInvoicePolicy);
//# sourceMappingURL=order-to-invoice.policy.js.map