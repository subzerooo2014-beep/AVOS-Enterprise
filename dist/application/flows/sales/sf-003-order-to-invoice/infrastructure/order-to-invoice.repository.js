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
exports.OrderToInvoiceRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../../prisma/prisma.service");
let OrderToInvoiceRepository = class OrderToInvoiceRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    transaction(fn) {
        return this.prisma.$transaction(fn);
    }
    findOrder(tx, orderId) {
        return tx.order.findUnique({
            where: { id: orderId },
            include: { invoice: true },
        });
    }
    createInvoice(tx, data) {
        return tx.invoice.create({
            data: {
                number: data.number,
                total: data.total,
                paidAmount: 0,
                balance: data.total,
                status: "UNPAID",
                customerId: data.customerId,
                orderId: data.orderId,
                notes: data.notes,
            },
        });
    }
    markOrderInvoiced(tx, orderId) {
        return tx.order.update({
            where: { id: orderId },
            data: { status: "INVOICED" },
        });
    }
    createAudit(tx, data) {
        return tx.auditLog.create({
            data: {
                action: "INVOICE_CREATED",
                entity: "Invoice",
                entityId: data.invoiceId,
                userId: data.customerId,
            },
        });
    }
};
exports.OrderToInvoiceRepository = OrderToInvoiceRepository;
exports.OrderToInvoiceRepository = OrderToInvoiceRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrderToInvoiceRepository);
//# sourceMappingURL=order-to-invoice.repository.js.map