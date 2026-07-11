"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sf004ReceivePaymentModule = void 0;
const common_1 = require("@nestjs/common");
const event_bus_module_1 = require("../../../../event-bus/event-bus.module");
const receive_payment_controller_1 = require("./receive-payment.controller");
const receive_payment_handler_1 = require("./receive-payment.handler");
const receive_payment_domain_service_1 = require("./domain/receive-payment.domain-service");
const receive_payment_policy_1 = require("./domain/receive-payment.policy");
const receive_payment_repository_1 = require("./infrastructure/receive-payment.repository");
let Sf004ReceivePaymentModule = class Sf004ReceivePaymentModule {
};
exports.Sf004ReceivePaymentModule = Sf004ReceivePaymentModule;
exports.Sf004ReceivePaymentModule = Sf004ReceivePaymentModule = __decorate([
    (0, common_1.Module)({
        imports: [event_bus_module_1.EventBusModule],
        controllers: [receive_payment_controller_1.ReceivePaymentController],
        providers: [
            receive_payment_handler_1.ReceivePaymentHandler,
            receive_payment_domain_service_1.ReceivePaymentDomainService,
            receive_payment_policy_1.ReceivePaymentPolicy,
            receive_payment_repository_1.ReceivePaymentRepository,
        ],
        exports: [receive_payment_handler_1.ReceivePaymentHandler],
    })
], Sf004ReceivePaymentModule);
//# sourceMappingURL=sf-004-receive-payment.module.js.map