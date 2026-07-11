"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CancelReservationHandler = void 0;
const common_1 = require("@nestjs/common");
const event_bus_service_1 = require("../../../event-bus/event-bus.service");
const cancel_reservation_policy_1 = require("./domain/cancel-reservation.policy");
const cancel_reservation_domain_service_1 = require("./domain/cancel-reservation.domain-service");
const cancel_reservation_repository_1 = require("./infrastructure/cancel-reservation.repository");
let CancelReservationHandler = class CancelReservationHandler {
    constructor(policy, domain, repository, eventBus) {
        this.policy = policy;
        this.domain = domain;
        this.repository = repository;
        this.eventBus = eventBus;
    }
    async execute(command) {
        const result = await this.repository.transaction(async (tx) => {
            const reservation = await this.repository.findReservation(tx, command.reservationId);
            this.domain.ensureReservationExists(reservation);
            this.policy.ensureCanCancel(reservation.status ?? "ACTIVE");
            const inventory = reservation.inventory;
            const vehicle = inventory?.vehicle;
            if (!inventory || !vehicle) {
                throw new Error("Reservation inventory or vehicle is missing");
            }
            const cancelledReservation = await this.repository.cancelReservation(tx, reservation.id, command.reason);
            const releasedInventory = await this.repository.releaseInventory(tx, inventory.id);
            const releasedVehicle = await this.repository.releaseVehicle(tx, vehicle.id);
            await this.repository.createMovement(tx, releasedInventory.id, releasedInventory.warehouseId, cancelledReservation.id);
            await this.repository.createAudit(tx, cancelledReservation.id);
            return {
                reservation: cancelledReservation,
                inventory: releasedInventory,
                vehicle: releasedVehicle,
                cancelledAt: new Date()
            };
        });
        this.eventBus.publish("ReservationCancelled", {
            reservationId: result.reservation.id,
            inventoryId: result.inventory.id,
            vehicleId: result.vehicle.id,
            reason: command.reason
        });
        return {
            reservationId: result.reservation.id,
            inventoryId: result.inventory.id,
            vehicleId: result.vehicle.id,
            status: result.reservation.status ?? "CANCELLED",
            cancelledAt: result.cancelledAt
        };
    }
};
exports.CancelReservationHandler = CancelReservationHandler;
exports.CancelReservationHandler = CancelReservationHandler = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [cancel_reservation_policy_1.CancelReservationPolicy,
        cancel_reservation_domain_service_1.CancelReservationDomainService,
        cancel_reservation_repository_1.CancelReservationRepository,
        event_bus_service_1.EventBusService])
], CancelReservationHandler);
//# sourceMappingURL=cancel-reservation.handler.js.map