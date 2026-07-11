"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderToInvoiceDomainService = void 0;
const common_1 = require("@nestjs/common");
const order_to_invoice_errors_1 = require("./order-to-invoice.errors");
let OrderToInvoiceDomainService = class OrderToInvoiceDomainService {
    ensureOrderExists(order) {
        if (!order) {
            throw new order_to_invoice_errors_1.OrderNotFoundException();
        }
    }
    createInvoiceNumber() {
        return `INV-${Date.now()}`;
    }
};
exports.OrderToInvoiceDomainService = OrderToInvoiceDomainService;
exports.OrderToInvoiceDomainService = OrderToInvoiceDomainService = __decorate([
    (0, common_1.Injectable)()
], OrderToInvoiceDomainService);
//# sourceMappingURL=order-to-invoice.domain-service.js.map