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
exports.ReceivePaymentRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../../prisma/prisma.service");
let ReceivePaymentRepository = class ReceivePaymentRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    transaction(fn) {
        return this.prisma.$transaction(fn);
    }
    findInvoice(tx, invoiceId) {
        return tx.invoice.findUnique({
            where: { id: invoiceId },
        });
    }
    createPayment(tx, data) {
        return tx.payment.create({
            data: {
                invoiceId: data.invoiceId,
                orderId: data.orderId,
                customerId: data.customerId,
                amount: data.amount,
                method: data.method,
                reference: data.reference,
                notes: data.notes,
                status: "PAID",
                paidAt: new Date(),
            },
        });
    }
    updateInvoicePaymentState(tx, data) {
        return tx.invoice.update({
            where: { id: data.invoiceId },
            data: {
                paidAmount: data.paidAmount,
                balance: data.balance,
                status: data.status,
            },
        });
    }
    createAudit(tx, data) {
        return tx.auditLog.create({
            data: {
                action: "PAYMENT_RECEIVED",
                entity: "Payment",
                entityId: data.paymentId,
                userId: data.customerId,
            },
        });
    }
};
exports.ReceivePaymentRepository = ReceivePaymentRepository;
exports.ReceivePaymentRepository = ReceivePaymentRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReceivePaymentRepository);
//# sourceMappingURL=receive-payment.repository.js.map