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
exports.ContractsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ContractsService = class ContractsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    delegate() {
        const client = this.prisma;
        if (!client.contract)
            throw new common_1.BadRequestException("Prisma delegate 'contract' is not available.");
        return client.contract;
    }
    clean(data) {
        const out = {};
        for (const [key, value] of Object.entries(data ?? {})) {
            if (value !== undefined && value !== null && value !== "")
                out[key] = value;
        }
        return out;
    }
    number() {
        return `CONTRACT-${Date.now()}`;
    }
    findAll(query = {}) {
        const where = {};
        if (query.status)
            where.status = query.status;
        if (query.customerId)
            where.customerId = query.customerId;
        return this.delegate().findMany({
            where,
            orderBy: { createdAt: "desc" },
            take: query.take ? Number(query.take) : 100,
        });
    }
    async findOne(id) {
        const item = await this.delegate().findUnique({ where: { id } });
        if (!item)
            throw new common_1.NotFoundException("Contract not found");
        return item;
    }
    create(dto) {
        return this.delegate().create({
            data: this.clean({
                ...dto,
                number: dto?.number ?? this.number(),
                status: dto?.status ?? "DRAFT",
                total: Number(dto?.total ?? 0),
            }),
        });
    }
    async update(id, dto) {
        await this.findOne(id);
        return this.delegate().update({
            where: { id },
            data: this.clean({
                ...dto,
                total: dto?.total !== undefined ? Number(dto.total) : undefined,
            }),
        });
    }
    async activate(id) {
        await this.findOne(id);
        return this.delegate().update({ where: { id }, data: { status: "ACTIVE" } });
    }
    async complete(id) {
        await this.findOne(id);
        return this.delegate().update({ where: { id }, data: { status: "COMPLETED" } });
    }
    async cancel(id) {
        await this.findOne(id);
        return this.delegate().update({ where: { id }, data: { status: "CANCELLED" } });
    }
    async remove(id) {
        await this.findOne(id);
        await this.delegate().delete({ where: { id } });
        return { deleted: true };
    }
};
exports.ContractsService = ContractsService;
exports.ContractsService = ContractsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ContractsService);
//# sourceMappingURL=contracts.service.js.map