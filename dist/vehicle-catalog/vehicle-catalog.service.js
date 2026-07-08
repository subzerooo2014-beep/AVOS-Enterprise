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
exports.VehicleCatalogService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const vehicle_catalog_utils_1 = require("./vehicle-catalog.utils");
let VehicleCatalogService = class VehicleCatalogService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async paginated(delegate, query) {
        const pagination = (0, vehicle_catalog_utils_1.toPagination)(query.page, query.limit);
        const where = (0, vehicle_catalog_utils_1.catalogWhere)(query.search, query.status);
        const [items, total] = await Promise.all([
            delegate.findMany({
                where,
                skip: pagination.skip,
                take: pagination.take,
                orderBy: { createdAt: 'desc' },
            }),
            delegate.count({ where }),
        ]);
        return {
            items,
            meta: {
                page: pagination.page,
                limit: pagination.limit,
                total,
                pages: Math.ceil(total / pagination.limit),
            },
        };
    }
    async findOne(delegate, id, entity) {
        const item = await delegate.findUnique({ where: { id } });
        if (!item)
            throw new common_1.NotFoundException(`${entity} not found`);
        return item;
    }
    brands(query) {
        return this.paginated(this.prisma.vehicleBrand, query);
    }
    createBrand(dto) {
        return this.prisma.vehicleBrand.create({
            data: { name: dto.name },
        });
    }
    brand(id) {
        return this.findOne(this.prisma.vehicleBrand, id, 'Vehicle brand');
    }
    async updateBrand(id, dto) {
        await this.brand(id);
        return this.prisma.vehicleBrand.update({
            where: { id },
            data: { name: dto.name },
        });
    }
    async deleteBrand(id) {
        await this.brand(id);
        return this.prisma.vehicleBrand.delete({ where: { id } });
    }
    models(query) {
        return this.paginated(this.prisma.vehicleModel, query);
    }
    async createModel(dto) {
        if (!dto.brandId)
            throw new common_1.BadRequestException('brandId is required');
        await this.brand(dto.brandId);
        return this.prisma.vehicleModel.create({
            data: {
                name: dto.name,
                brandId: dto.brandId,
            },
        });
    }
    model(id) {
        return this.findOne(this.prisma.vehicleModel, id, 'Vehicle model');
    }
    async updateModel(id, dto) {
        await this.model(id);
        return this.prisma.vehicleModel.update({
            where: { id },
            data: { name: dto.name },
        });
    }
    async deleteModel(id) {
        await this.model(id);
        return this.prisma.vehicleModel.delete({ where: { id } });
    }
    trims(query) {
        return this.paginated(this.prisma.vehicleTrim, query);
    }
    async createTrim(dto) {
        if (!dto.modelId)
            throw new common_1.BadRequestException('modelId is required');
        await this.model(dto.modelId);
        return this.prisma.vehicleTrim.create({
            data: {
                name: dto.name,
                modelId: dto.modelId,
            },
        });
    }
    trim(id) {
        return this.findOne(this.prisma.vehicleTrim, id, 'Vehicle trim');
    }
    async updateTrim(id, dto) {
        await this.trim(id);
        return this.prisma.vehicleTrim.update({
            where: { id },
            data: { name: dto.name },
        });
    }
    async deleteTrim(id) {
        await this.trim(id);
        return this.prisma.vehicleTrim.delete({ where: { id } });
    }
    async catalogSummary() {
        const [brands, models, trims, categories, features, options] = await Promise.all([
            this.prisma.vehicleBrand.count(),
            this.prisma.vehicleModel.count(),
            this.prisma.vehicleTrim.count(),
            this.prisma.vehicleCategory.count(),
            this.prisma.vehicleFeature.count(),
            this.prisma.vehicleOption.count(),
        ]);
        return {
            brands,
            models,
            trims,
            categories,
            features,
            options,
            generatedAt: new Date().toISOString(),
        };
    }
};
exports.VehicleCatalogService = VehicleCatalogService;
exports.VehicleCatalogService = VehicleCatalogService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], VehicleCatalogService);
//# sourceMappingURL=vehicle-catalog.service.js.map