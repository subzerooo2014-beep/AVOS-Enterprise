"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuoteToSalesOrderPolicy = void 0;
const common_1 = require("@nestjs/common");
const quote_to_sales_order_errors_1 = require("./quote-to-sales-order.errors");
let QuoteToSalesOrderPolicy = class QuoteToSalesOrderPolicy {
    ensureHasCustomer(customerId) {
        if (!customerId) {
            throw new quote_to_sales_order_errors_1.QuoteCustomerMissingException();
        }
    }
    ensureNotConverted(order) {
        if (order) {
            throw new quote_to_sales_order_errors_1.QuoteAlreadyConvertedException();
        }
    }
    ensureConvertible(status) {
        if (status === "CANCELLED" || status === "EXPIRED") {
            throw new quote_to_sales_order_errors_1.QuoteNotConvertibleException();
        }
    }
};
exports.QuoteToSalesOrderPolicy = QuoteToSalesOrderPolicy;
exports.QuoteToSalesOrderPolicy = QuoteToSalesOrderPolicy = __decorate([
    (0, common_1.Injectable)()
], QuoteToSalesOrderPolicy);
//# sourceMappingURL=quote-to-sales-order.policy.js.map