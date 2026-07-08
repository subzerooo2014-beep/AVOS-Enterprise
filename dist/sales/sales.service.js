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
exports.SalesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const sales_mapper_1 = require("./mappers/sales.mapper");
const sales_policy_1 = require("./policies/sales.policy");
const sales_query_helper_1 = require("./helpers/sales-query.helper");
const sales_number_helper_1 = require("./helpers/sales-number.helper");
let SalesService = class SalesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    saleDelegate() {
        const client = this.prisma;
        if (!client.sale) {
            throw new common_1.BadRequestException("Prisma delegate 'sale' is not available. Run pnpm prisma generate.");
        }
        return client.sale;
    }
    async findAll(query = {}) {
        const delegate = this.saleDelegate();
        const { page, limit, skip, take } = (0, sales_query_helper_1.normalizeSalesPaging)(query);
        const where = (0, sales_query_helper_1.buildSalesWhere)(query);
        const [items, total] = await Promise.all([
            delegate.findMany({ where, skip, take, orderBy: { createdAt: "desc" } }),
            delegate.count({ where }),
        ]);
        return {
            items,
            meta: { page, limit, total, pages: Math.ceil(total / limit) },
        };
    }
    async findOne(id) {
        const sale = await this.saleDelegate().findUnique({ where: { id } });
        sales_policy_1.SalesPolicy.ensureExists(sale);
        return sale;
    }
    async create(dto) {
        const data = sales_mapper_1.SalesMapper.toCreate({
            ...dto,
            number: dto?.number ?? (0, sales_number_helper_1.createSalesNumber)(),
        });
        return this.saleDelegate().create({ data });
    }
    async update(id, dto) {
        const sale = await this.findOne(id);
        sales_policy_1.SalesPolicy.ensureCanUpdate(sale);
        return this.saleDelegate().update({
            where: { id },
            data: sales_mapper_1.SalesMapper.toUpdate(dto),
        });
    }
    async changeStatus(id, status) {
        sales_policy_1.SalesPolicy.ensureValidStatus(status);
        await this.findOne(id);
        return this.saleDelegate().update({
            where: { id },
            data: { status },
        });
    }
    async submit(id) {
        return this.changeStatus(id, "PENDING_APPROVAL");
    }
    async approve(id) {
        return this.changeStatus(id, "APPROVED");
    }
    async closeWon(id) {
        return this.changeStatus(id, "WON");
    }
    async closeLost(id) {
        return this.changeStatus(id, "LOST");
    }
    async cancel(id) {
        return this.changeStatus(id, "CANCELLED");
    }
    async close(id) {
        return this.changeStatus(id, "CLOSED");
    }
    async remove(id) {
        const sale = await this.findOne(id);
        sales_policy_1.SalesPolicy.ensureCanDelete(sale);
        return this.saleDelegate().delete({ where: { id } });
    }
    async dashboard() {
        const delegate = this.saleDelegate();
        const [totalSales, openSales, draftSales, pendingSales, approvedSales, wonSales, lostSales, cancelledSales, closedSales,] = await Promise.all([
            delegate.count(),
            delegate.count({ where: { status: "OPEN" } }),
            delegate.count({ where: { status: "DRAFT" } }),
            delegate.count({ where: { status: "PENDING_APPROVAL" } }),
            delegate.count({ where: { status: "APPROVED" } }),
            delegate.count({ where: { status: "WON" } }),
            delegate.count({ where: { status: "LOST" } }),
            delegate.count({ where: { status: "CANCELLED" } }),
            delegate.count({ where: { status: "CLOSED" } }),
        ]);
        return {
            totalSales,
            openSales,
            draftSales,
            pendingSales,
            approvedSales,
            wonSales,
            lostSales,
            cancelledSales,
            closedSales,
            activeSales: openSales + draftSales + pendingSales + approvedSales,
            winRate: totalSales ? Number(((wonSales / totalSales) * 100).toFixed(2)) : 0,
        };
    }
};
exports.SalesService = SalesService;
exports.SalesService = SalesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SalesService);
//# sourceMappingURL=sales.service.js.map