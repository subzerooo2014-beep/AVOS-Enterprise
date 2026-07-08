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
exports.FinanceService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let FinanceService = class FinanceService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createInvoice(dto) {
        const totalAmount = Number(dto.amount) +
            Number(dto.taxAmount ?? 0) -
            Number(dto.discountAmount ?? 0);
        if (totalAmount <= 0) {
            throw new common_1.BadRequestException('Invoice total must be greater than zero');
        }
        const invoice = await this.prisma.invoice.create({
            data: {
                saleId: dto.saleId,
                customerId: dto.customerId,
                amount: dto.amount,
                taxAmount: dto.taxAmount ?? 0,
                discountAmount: dto.discountAmount ?? 0,
                totalAmount,
                paidAmount: 0,
                status: 'UNPAID',
                dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
                notes: dto.notes,
            },
        });
        await this.createLedgerEntry({
            type: 'INVOICE',
            title: `Invoice created`,
            amount: totalAmount,
            referenceType: 'INVOICE',
            referenceId: invoice.id,
            notes: dto.notes,
        });
        return invoice;
    }
    async listInvoices() {
        return this.prisma.invoice.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }
    async getInvoice(id) {
        const invoice = await this.prisma.invoice.findUnique({
            where: { id },
            include: { payments: true },
        });
        if (!invoice) {
            throw new common_1.NotFoundException('Invoice not found');
        }
        return invoice;
    }
    async createPayment(dto) {
        const invoice = await this.prisma.invoice.findUnique({
            where: { id: dto.invoiceId },
        });
        if (!invoice) {
            throw new common_1.NotFoundException('Invoice not found');
        }
        if (dto.amount <= 0) {
            throw new common_1.BadRequestException('Payment amount must be greater than zero');
        }
        const newPaidAmount = Number(invoice.paidAmount) + Number(dto.amount);
        if (newPaidAmount > Number(invoice.totalAmount)) {
            throw new common_1.BadRequestException('Payment exceeds invoice total');
        }
        const status = newPaidAmount >= Number(invoice.totalAmount)
            ? 'PAID'
            : newPaidAmount > 0
                ? 'PARTIALLY_PAID'
                : 'UNPAID';
        const payment = await this.prisma.payment.create({
            data: {
                invoiceId: dto.invoiceId,
                amount: dto.amount,
                method: dto.method ?? 'CASH',
                reference: dto.reference,
                notes: dto.notes,
            },
        });
        await this.prisma.invoice.update({
            where: { id: dto.invoiceId },
            data: {
                paidAmount: newPaidAmount,
                status,
            },
        });
        await this.createLedgerEntry({
            type: 'PAYMENT',
            title: `Payment received`,
            amount: dto.amount,
            referenceType: 'PAYMENT',
            referenceId: payment.id,
            notes: dto.notes,
        });
        return payment;
    }
    async listPayments() {
        return this.prisma.payment.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }
    async createLedgerEntry(dto) {
        return this.prisma.ledgerEntry.create({
            data: {
                type: dto.type,
                title: dto.title,
                amount: dto.amount,
                referenceType: dto.referenceType,
                referenceId: dto.referenceId,
                notes: dto.notes,
            },
        });
    }
    async listLedger() {
        return this.prisma.ledgerEntry.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }
    async financeSummary() {
        const invoices = await this.prisma.invoice.findMany();
        const payments = await this.prisma.payment.findMany();
        const totalInvoiced = invoices.reduce((sum, i) => sum + Number(i.totalAmount), 0);
        const totalPaid = payments.reduce((sum, p) => sum + Number(p.amount), 0);
        const outstanding = totalInvoiced - totalPaid;
        return {
            totalInvoiced,
            totalPaid,
            outstanding,
            invoiceCount: invoices.length,
            paymentCount: payments.length,
        };
    }
};
exports.FinanceService = FinanceService;
exports.FinanceService = FinanceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FinanceService);
//# sourceMappingURL=finance.service.js.map