"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CancelReservationModule = void 0;
const common_1 = require("@nestjs/common");
const event_bus_module_1 = require("../../../event-bus/event-bus.module");
const cancel_reservation_controller_1 = require("./cancel-reservation.controller");
const cancel_reservation_handler_1 = require("./cancel-reservation.handler");
const cancel_reservation_policy_1 = require("./domain/cancel-reservation.policy");
const cancel_reservation_domain_service_1 = require("./domain/cancel-reservation.domain-service");
const cancel_reservation_repository_1 = require("./infrastructure/cancel-reservation.repository");
let CancelReservationModule = class CancelReservationModule {
};
exports.CancelReservationModule = CancelReservationModule;
exports.CancelReservationModule = CancelReservationModule = __decorate([
    (0, common_1.Module)({
        imports: [
            event_bus_module_1.EventBusModule
        ],
        controllers: [
            cancel_reservation_controller_1.CancelReservationController
        ],
        providers: [
            cancel_reservation_handler_1.CancelReservationHandler,
            cancel_reservation_policy_1.CancelReservationPolicy,
            cancel_reservation_domain_service_1.CancelReservationDomainService,
            cancel_reservation_repository_1.CancelReservationRepository
        ],
        exports: [
            cancel_reservation_handler_1.CancelReservationHandler
        ]
    })
], CancelReservationModule);
//# sourceMappingURL=cancel-reservation.module.js.map