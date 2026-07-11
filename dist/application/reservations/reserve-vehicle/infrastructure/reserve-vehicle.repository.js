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
exports.ReserveVehicleRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../prisma/prisma.service");
let ReserveVehicleRepository = class ReserveVehicleRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    transaction(fn) {
        return this.prisma.$transaction(fn);
    }
    findVehicleWithInventory(tx, vehicleId) {
        return tx.vehicle.findUnique({
            where: { id: vehicleId },
            include: { inventory: true },
        });
    }
    createReservation(tx, data) {
        return tx.reservation.create({ data });
    }
    reserveInventory(tx, inventoryId) {
        return tx.inventory.update({
            where: { id: inventoryId },
            data: {
                status: "RESERVED",
                reserved: true,
                reservedAt: new Date(),
            },
        });
    }
    reserveVehicle(tx, vehicleId) {
        return tx.vehicle.update({
            where: { id: vehicleId },
            data: { status: "RESERVED" },
        });
    }
    createStockMovement(tx, data) {
        return tx.stockMovement.create({
            data: {
                inventoryId: data.inventoryId,
                warehouseId: data.warehouseId,
                type: "RESERVATION",
                quantity: 1,
                reference: data.reservationId,
                reason: "Vehicle reserved",
                notes: data.notes,
                status: "POSTED",
            },
        });
    }
    createAuditLog(tx, data) {
        return tx.auditLog.create({
            data: {
                action: "VEHICLE_RESERVED",
                entity: "Reservation",
                entityId: data.reservationId,
            },
        });
    }
};
exports.ReserveVehicleRepository = ReserveVehicleRepository;
exports.ReserveVehicleRepository = ReserveVehicleRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReserveVehicleRepository);
//# sourceMappingURL=reserve-vehicle.repository.js.map