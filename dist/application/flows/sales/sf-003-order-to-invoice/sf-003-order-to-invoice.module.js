"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sf003OrderToInvoiceModule = void 0;
const common_1 = require("@nestjs/common");
const event_bus_module_1 = require("../../../../event-bus/event-bus.module");
const order_to_invoice_controller_1 = require("./order-to-invoice.controller");
const order_to_invoice_handler_1 = require("./order-to-invoice.handler");
const order_to_invoice_domain_service_1 = require("./domain/order-to-invoice.domain-service");
const order_to_invoice_policy_1 = require("./domain/order-to-invoice.policy");
const order_to_invoice_repository_1 = require("./infrastructure/order-to-invoice.repository");
let Sf003OrderToInvoiceModule = class Sf003OrderToInvoiceModule {
};
exports.Sf003OrderToInvoiceModule = Sf003OrderToInvoiceModule;
exports.Sf003OrderToInvoiceModule = Sf003OrderToInvoiceModule = __decorate([
    (0, common_1.Module)({
        imports: [event_bus_module_1.EventBusModule],
        controllers: [order_to_invoice_controller_1.OrderToInvoiceController],
        providers: [
            order_to_invoice_handler_1.OrderToInvoiceHandler,
            order_to_invoice_domain_service_1.OrderToInvoiceDomainService,
            order_to_invoice_policy_1.OrderToInvoicePolicy,
            order_to_invoice_repository_1.OrderToInvoiceRepository,
        ],
        exports: [order_to_invoice_handler_1.OrderToInvoiceHandler],
    })
], Sf003OrderToInvoiceModule);
//# sourceMappingURL=sf-003-order-to-invoice.module.js.map