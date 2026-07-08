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
exports.VehiclesRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const base_repository_1 = require("../../common/repositories/base.repository");
let VehiclesRepository = class VehiclesRepository extends base_repository_1.BaseRepository {
    constructor(prisma) {
        super(prisma);
    }
    normalizePage(value) {
        return Math.max(Number(value || 1), 1);
    }
    normalizeLimit(value) {
        return Math.min(Math.max(Number(value || 20), 1), 100);
    }
    safeSort(sort) {
        const allowed = ["createdAt", "updatedAt", "vin", "make", "model", "year", "status", "location"];
        return allowed.includes(sort || "") ? sort : "createdAt";
    }
    async findPage(query) {
        const page = this.normalizePage(query.page);
        const limit = this.normalizeLimit(query.limit);
        const where = {};
        if (query.make)
            where.make = { contains: query.make };
        if (query.model)
            where.model = { contains: query.model };
        if (query.year)
            where.year = query.year;
        if (query.color)
            where.color = { contains: query.color };
        if (query.status)
            where.status = query.status;
        if (query.location)
            where.location = { contains: query.location };
        if (query.search) {
            where.OR = [
                { vin: { contains: query.search } },
                { make: { contains: query.search } },
                { model: { contains: query.search } },
                { color: { contains: query.search } },
                { location: { contains: query.search } },
            ];
        }
        const sort = this.safeSort(query.sort);
        const order = query.order === "asc" ? "asc" : "desc";
        const [items, total] = await Promise.all([
            this.prisma.vehicle.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { [sort]: order },
            }),
            this.prisma.vehicle.count({ where }),
        ]);
        return {
            items,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                hasNextPage: page * limit < total,
                hasPreviousPage: page > 1,
            },
        };
    }
    findByVin(vin) {
        return this.prisma.vehicle.findUnique({ where: { vin } });
    }
    findById(id) {
        return this.prisma.vehicle.findUnique({ where: { id } });
    }
    create(data) {
        return this.prisma.vehicle.create({
            data: {
                ...data,
                status: data.status ?? "AVAILABLE",
            },
        });
    }
    update(id, data) {
        return this.prisma.vehicle.update({
            where: { id },
            data,
        });
    }
    delete(id) {
        return this.prisma.vehicle.delete({
            where: { id },
        });
    }
    async stats() {
        const [total, available, sold, reserved] = await Promise.all([
            this.prisma.vehicle.count(),
            this.prisma.vehicle.count({ where: { status: "AVAILABLE" } }),
            this.prisma.vehicle.count({ where: { status: "SOLD" } }),
            this.prisma.vehicle.count({ where: { status: "RESERVED" } }),
        ]);
        return {
            total,
            available,
            sold,
            reserved,
            generatedAt: new Date().toISOString(),
        };
    }
};
exports.VehiclesRepository = VehiclesRepository;
exports.VehiclesRepository = VehiclesRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], VehiclesRepository);
//# sourceMappingURL=vehicles.repository.js.map