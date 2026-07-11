"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderNotInvoiceableException = exports.OrderAlreadyInvoicedException = exports.OrderNotFoundException = void 0;
const common_1 = require("@nestjs/common");
class OrderNotFoundException extends common_1.NotFoundException {
    constructor() {
        super("Order not found");
    }
}
exports.OrderNotFoundException = OrderNotFoundException;
class OrderAlreadyInvoicedException extends common_1.BadRequestException {
    constructor() {
        super("Order already has an invoice");
    }
}
exports.OrderAlreadyInvoicedException = OrderAlreadyInvoicedException;
class OrderNotInvoiceableException extends common_1.BadRequestException {
    constructor() {
        super("Order cannot be invoiced");
    }
}
exports.OrderNotInvoiceableException = OrderNotInvoiceableException;
//# sourceMappingURL=order-to-invoice.errors.js.map