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
exports.ReserveVehicleHandler = void 0;
const common_1 = require("@nestjs/common");
const reserve_vehicle_policy_1 = require("./domain/reserve-vehicle.policy");
const reserve_vehicle_domain_service_1 = require("./domain/reserve-vehicle.domain-service");
const reserve_vehicle_repository_1 = require("./infrastructure/reserve-vehicle.repository");
const event_bus_service_1 = require("../../../event-bus/event-bus.service");
let ReserveVehicleHandler = class ReserveVehicleHandler {
    constructor(policy, domain, repository, eventBus) {
        this.policy = policy;
        this.domain = domain;
        this.repository = repository;
        this.eventBus = eventBus;
    }
    async execute(command) {
        const expiresAt = this.policy.createExpiryDate();
        const result = await this.repository.transaction(async (tx) => {
            const vehicle = await this.repository.findVehicleWithInventory(tx, command.vehicleId);
            this.domain.ensureVehicleExists(vehicle);
            this.domain.ensureInventoryExists(vehicle.inventory);
            const inventory = vehicle.inventory;
            this.domain.ensureCanReserve({
                vehicleStatus: vehicle.status,
                inventoryStatus: inventory.status,
                inventoryReserved: inventory.reserved,
            });
            const reservation = await this.repository.createReservation(tx, {
                inventoryId: inventory.id,
                customerId: command.customerId,
                status: "ACTIVE",
                expiresAt,
                notes: command.notes,
            });
            const updatedInventory = await this.repository.reserveInventory(tx, inventory.id);
            const updatedVehicle = await this.repository.reserveVehicle(tx, vehicle.id);
            await this.repository.createStockMovement(tx, {
                inventoryId: updatedInventory.id,
                warehouseId: updatedInventory.warehouseId,
                reservationId: reservation.id,
                notes: command.notes,
            });
            await this.repository.createAuditLog(tx, {
                reservationId: reservation.id,
            });
            return {
                reservation,
                inventory: updatedInventory,
                vehicle: updatedVehicle,
            };
        });
        this.eventBus.publish("VehicleReserved", {
            reservationId: result.reservation.id,
            vehicleId: result.vehicle.id,
            inventoryId: result.inventory.id,
            customerId: command.customerId,
        });
        return {
            reservationId: result.reservation.id,
            inventoryId: result.inventory.id,
            vehicleId: result.vehicle.id,
            customerId: command.customerId,
            status: result.reservation.status ?? "ACTIVE",
            expiresAt: result.reservation.expiresAt,
        };
    }
};
exports.ReserveVehicleHandler = ReserveVehicleHandler;
exports.ReserveVehicleHandler = ReserveVehicleHandler = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [reserve_vehicle_policy_1.ReserveVehiclePolicy,
        reserve_vehicle_domain_service_1.ReserveVehicleDomainService,
        reserve_vehicle_repository_1.ReserveVehicleRepository,
        event_bus_service_1.EventBusService])
], ReserveVehicleHandler);
//# sourceMappingURL=reserve-vehicle.handler.js.map