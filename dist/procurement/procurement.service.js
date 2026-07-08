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
exports.ProcurementService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const procurement_enums_1 = require("./procurement.enums");
let ProcurementService = class ProcurementService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createSupplier(dto) {
        return this.prisma.supplier.create({
            data: {
                name: dto.name,
                phone: dto.phone,
                email: dto.email,
                address: dto.address,
                status: dto.status ?? procurement_enums_1.SupplierStatus.ACTIVE,
            },
        });
    }
    async findSuppliers() {
        return this.prisma.supplier.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }
    async findSupplier(id) {
        const supplier = await this.prisma.supplier.findUnique({ where: { id } });
        if (!supplier)
            throw new common_1.NotFoundException('Supplier not found');
        return supplier;
    }
    async updateSupplier(id, dto) {
        await this.findSupplier(id);
        return this.prisma.supplier.update({
            where: { id },
            data: dto,
        });
    }
    async deleteSupplier(id) {
        await this.findSupplier(id);
        return this.prisma.supplier.delete({ where: { id } });
    }
    async createPurchaseOrder(dto) {
        await this.findSupplier(dto.supplierId);
        const total = dto.items.reduce((sum, item) => {
            return sum + item.quantity * item.unitPrice;
        }, 0);
        return this.prisma.purchaseOrder.create({
            data: {
                supplierId: dto.supplierId,
                status: dto.status ?? procurement_enums_1.PurchaseOrderStatus.DRAFT,
                total,
                items: {
                    create: dto.items.map((item) => ({
                        itemName: item.itemName,
                        quantity: item.quantity,
                        unitPrice: item.unitPrice,
                        total: item.quantity * item.unitPrice,
                    })),
                },
            },
            include: { supplier: true, items: true },
        });
    }
    async findPurchaseOrders() {
        return this.prisma.purchaseOrder.findMany({
            include: { supplier: true, items: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findPurchaseOrder(id) {
        const order = await this.prisma.purchaseOrder.findUnique({
            where: { id },
            include: { supplier: true, items: true },
        });
        if (!order)
            throw new common_1.NotFoundException('Purchase order not found');
        return order;
    }
    async updatePurchaseOrder(id, dto) {
        await this.findPurchaseOrder(id);
        return this.prisma.purchaseOrder.update({
            where: { id },
            data: dto,
            include: { supplier: true, items: true },
        });
    }
    async deletePurchaseOrder(id) {
        await this.findPurchaseOrder(id);
        return this.prisma.purchaseOrder.delete({ where: { id } });
    }
};
exports.ProcurementService = ProcurementService;
exports.ProcurementService = ProcurementService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProcurementService);
//# sourceMappingURL=procurement.service.js.map