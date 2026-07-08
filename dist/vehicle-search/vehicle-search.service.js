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
exports.VehicleSearchService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let VehicleSearchService = class VehicleSearchService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    search(dto) {
        return this.prisma.vehicle.findMany({
            where: {
                AND: [
                    dto.q ? {
                        OR: [
                            { vin: { contains: dto.q, mode: "insensitive" } },
                            { make: { contains: dto.q, mode: "insensitive" } },
                            { model: { contains: dto.q, mode: "insensitive" } },
                            { color: { contains: dto.q, mode: "insensitive" } },
                        ],
                    } : {},
                    dto.make ? { make: { contains: dto.make, mode: "insensitive" } } : {},
                    dto.model ? { model: { contains: dto.model, mode: "insensitive" } } : {},
                    dto.yearFrom ? { year: { gte: dto.yearFrom } } : {},
                    dto.yearTo ? { year: { lte: dto.yearTo } } : {},
                ],
            },
            orderBy: { createdAt: "desc" },
        });
    }
};
exports.VehicleSearchService = VehicleSearchService;
exports.VehicleSearchService = VehicleSearchService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], VehicleSearchService);
//# sourceMappingURL=vehicle-search.service.js.map