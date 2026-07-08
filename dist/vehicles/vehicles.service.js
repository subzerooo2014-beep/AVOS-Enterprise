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
exports.VehiclesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const vehicles_repository_1 = require("./repositories/vehicles.repository");
let VehiclesService = class VehiclesService {
    constructor(prisma, repository) {
        this.prisma = prisma;
        this.repository = repository;
    }
    findAll(query = {}) {
        return this.repository.findPage(query);
    }
    stats() {
        return this.repository.stats();
    }
    async findOne(id) {
        const vehicle = await this.repository.findById(id);
        if (!vehicle) {
            throw new common_1.NotFoundException("Vehicle not found");
        }
        return vehicle;
    }
    async create(dto) {
        const exists = await this.repository.findByVin(dto.vin);
        if (exists) {
            throw new common_1.ConflictException("VIN already exists");
        }
        return this.prisma.$transaction(async () => {
            const vehicle = await this.repository.create(dto);
            await this.prisma.auditLog.create({
                data: {
                    action: "VEHICLE_CREATED",
                    entity: "Vehicle",
                    entityId: vehicle.id,
                },
            });
            return vehicle;
        });
    }
    async update(id, dto) {
        await this.findOne(id);
        if (dto.vin) {
            const exists = await this.repository.findByVin(dto.vin);
            if (exists && exists.id !== id) {
                throw new common_1.ConflictException("VIN already exists");
            }
        }
        return this.prisma.$transaction(async () => {
            const vehicle = await this.repository.update(id, dto);
            await this.prisma.auditLog.create({
                data: {
                    action: "VEHICLE_UPDATED",
                    entity: "Vehicle",
                    entityId: id,
                },
            });
            return vehicle;
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.$transaction(async () => {
            await this.repository.delete(id);
            await this.prisma.auditLog.create({
                data: {
                    action: "VEHICLE_DELETED",
                    entity: "Vehicle",
                    entityId: id,
                },
            });
            return { deleted: true };
        });
    }
};
exports.VehiclesService = VehiclesService;
exports.VehiclesService = VehiclesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        vehicles_repository_1.VehiclesRepository])
], VehiclesService);
//# sourceMappingURL=vehicles.service.js.map