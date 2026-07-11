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
exports.QuoteToSalesOrderRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../../prisma/prisma.service");
let QuoteToSalesOrderRepository = class QuoteToSalesOrderRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    transaction(fn) {
        return this.prisma.$transaction(fn);
    }
    findQuote(tx, quoteId) {
        return tx.quote.findUnique({
            where: { id: quoteId },
            include: { order: true },
        });
    }
    createSalesOrder(tx, data) {
        return tx.salesOrder.create({
            data: {
                customerId: data.customerId,
                status: "DRAFT",
                totalAmount: data.totalAmount,
            },
        });
    }
    createLegacyOrder(tx, data) {
        return tx.order.create({
            data: {
                quoteId: data.quoteId,
                customerId: data.customerId,
                status: "DRAFT",
                total: data.total,
                notes: data.notes,
            },
        });
    }
    markQuoteApproved(tx, quoteId) {
        return tx.quote.update({
            where: { id: quoteId },
            data: { status: "APPROVED" },
        });
    }
    createAudit(tx, data) {
        return tx.auditLog.create({
            data: {
                action: "QUOTE_CONVERTED_TO_SALES_ORDER",
                entity: "SalesOrder",
                entityId: data.salesOrderId,
                userId: data.customerId,
            },
        });
    }
};
exports.QuoteToSalesOrderRepository = QuoteToSalesOrderRepository;
exports.QuoteToSalesOrderRepository = QuoteToSalesOrderRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], QuoteToSalesOrderRepository);
//# sourceMappingURL=quote-to-sales-order.repository.js.map