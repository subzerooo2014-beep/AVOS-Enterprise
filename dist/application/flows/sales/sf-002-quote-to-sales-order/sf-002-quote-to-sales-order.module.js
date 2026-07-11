"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sf002QuoteToSalesOrderModule = void 0;
const common_1 = require("@nestjs/common");
const event_bus_module_1 = require("../../../../event-bus/event-bus.module");
const quote_to_sales_order_controller_1 = require("./quote-to-sales-order.controller");
const quote_to_sales_order_handler_1 = require("./quote-to-sales-order.handler");
const quote_to_sales_order_domain_service_1 = require("./domain/quote-to-sales-order.domain-service");
const quote_to_sales_order_policy_1 = require("./domain/quote-to-sales-order.policy");
const quote_to_sales_order_repository_1 = require("./infrastructure/quote-to-sales-order.repository");
let Sf002QuoteToSalesOrderModule = class Sf002QuoteToSalesOrderModule {
};
exports.Sf002QuoteToSalesOrderModule = Sf002QuoteToSalesOrderModule;
exports.Sf002QuoteToSalesOrderModule = Sf002QuoteToSalesOrderModule = __decorate([
    (0, common_1.Module)({
        imports: [event_bus_module_1.EventBusModule],
        controllers: [quote_to_sales_order_controller_1.QuoteToSalesOrderController],
        providers: [
            quote_to_sales_order_handler_1.QuoteToSalesOrderHandler,
            quote_to_sales_order_domain_service_1.QuoteToSalesOrderDomainService,
            quote_to_sales_order_policy_1.QuoteToSalesOrderPolicy,
            quote_to_sales_order_repository_1.QuoteToSalesOrderRepository,
        ],
        exports: [quote_to_sales_order_handler_1.QuoteToSalesOrderHandler],
    })
], Sf002QuoteToSalesOrderModule);
//# sourceMappingURL=sf-002-quote-to-sales-order.module.js.map