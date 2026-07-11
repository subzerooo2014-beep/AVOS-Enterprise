"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuoteNotConvertibleException = exports.QuoteAlreadyConvertedException = exports.QuoteCustomerMissingException = exports.QuoteNotFoundException = void 0;
const common_1 = require("@nestjs/common");
class QuoteNotFoundException extends common_1.NotFoundException {
    constructor() {
        super("Quote not found");
    }
}
exports.QuoteNotFoundException = QuoteNotFoundException;
class QuoteCustomerMissingException extends common_1.BadRequestException {
    constructor() {
        super("Quote must have a customer before conversion");
    }
}
exports.QuoteCustomerMissingException = QuoteCustomerMissingException;
class QuoteAlreadyConvertedException extends common_1.BadRequestException {
    constructor() {
        super("Quote already converted to order");
    }
}
exports.QuoteAlreadyConvertedException = QuoteAlreadyConvertedException;
class QuoteNotConvertibleException extends common_1.BadRequestException {
    constructor() {
        super("Quote is not convertible");
    }
}
exports.QuoteNotConvertibleException = QuoteNotConvertibleException;
//# sourceMappingURL=quote-to-sales-order.errors.js.map