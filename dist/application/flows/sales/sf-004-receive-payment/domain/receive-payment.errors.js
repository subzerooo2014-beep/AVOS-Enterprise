"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidPaymentAmountException = exports.InvoiceAlreadyPaidException = exports.InvoiceNotFoundException = void 0;
const common_1 = require("@nestjs/common");
class InvoiceNotFoundException extends common_1.NotFoundException {
    constructor() {
        super("Invoice not found");
    }
}
exports.InvoiceNotFoundException = InvoiceNotFoundException;
class InvoiceAlreadyPaidException extends common_1.BadRequestException {
    constructor() {
        super("Invoice already paid");
    }
}
exports.InvoiceAlreadyPaidException = InvoiceAlreadyPaidException;
class InvalidPaymentAmountException extends common_1.BadRequestException {
    constructor() {
        super("Payment amount is invalid");
    }
}
exports.InvalidPaymentAmountException = InvalidPaymentAmountException;
//# sourceMappingURL=receive-payment.errors.js.map