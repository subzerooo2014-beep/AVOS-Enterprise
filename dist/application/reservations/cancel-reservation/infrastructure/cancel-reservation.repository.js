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
exports.CancelReservationRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../prisma/prisma.service");
let CancelReservationRepository = class CancelReservationRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    transaction(fn) {
        return this.prisma.$transaction(fn);
    }
    findReservation(tx, reservationId) {
        return tx.reservation.findUnique({
            where: {
                id: reservationId
            },
            include: {
                inventory: {
                    include: {
                        vehicle: true
                    }
                }
            }
        });
    }
    cancelReservation(tx, reservationId, reason) {
        return tx.reservation.update({
            where: {
                id: reservationId
            },
            data: {
                status: "CANCELLED",
                notes: reason,
                updatedAt: new Date()
            }
        });
    }
    releaseInventory(tx, inventoryId) {
        return tx.inventory.update({
            where: {
                id: inventoryId
            },
            data: {
                status: "AVAILABLE",
                reserved: false,
                reservedAt: null
            }
        });
    }
    releaseVehicle(tx, vehicleId) {
        return tx.vehicle.update({
            where: {
                id: vehicleId
            },
            data: {
                status: "AVAILABLE"
            }
        });
    }
    createMovement(tx, inventoryId, warehouseId, reservationId) {
        return tx.stockMovement.create({
            data: {
                inventoryId,
                warehouseId,
                type: "RESERVATION_CANCEL",
                quantity: 1,
                reference: reservationId,
                reason: "Reservation cancelled",
                status: "POSTED"
            }
        });
    }
    createAudit(tx, reservationId) {
        return tx.auditLog.create({
            data: {
                action: "RESERVATION_CANCELLED",
                entity: "Reservation",
                entityId: reservationId
            }
        });
    }
};
exports.CancelReservationRepository = CancelReservationRepository;
exports.CancelReservationRepository = CancelReservationRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CancelReservationRepository);
//# sourceMappingURL=cancel-reservation.repository.js.map