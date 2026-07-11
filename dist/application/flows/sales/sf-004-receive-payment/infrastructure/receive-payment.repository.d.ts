import { Prisma } from "@prisma/client";
import { PrismaService } from "../../../../../prisma/prisma.service";
type Tx = Prisma.TransactionClient;
export declare class ReceivePaymentRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    transaction<T>(fn: (tx: Tx) => Promise<T>): Promise<T>;
    findInvoice(tx: Tx, invoiceId: string): Prisma.Prisma__InvoiceClient<{
        number: string;
        id: string;
        status: string;
        total: number;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        orderId: string | null;
        customerId: string | null;
        paidAmount: number;
        balance: number;
        dueDate: Date | null;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
    createPayment(tx: Tx, data: {
        invoiceId: string;
        orderId: string | null;
        customerId: string | null;
        amount: number;
        method?: string;
        reference?: string;
        notes?: string;
    }): Prisma.Prisma__PaymentClient<{
        id: string;
        status: string;
        method: string | null;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        orderId: string | null;
        customerId: string | null;
        reference: string | null;
        invoiceId: string | null;
        amount: number;
        paidAt: Date | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
    updateInvoicePaymentState(tx: Tx, data: {
        invoiceId: string;
        paidAmount: number;
        balance: number;
        status: string;
    }): Prisma.Prisma__InvoiceClient<{
        number: string;
        id: string;
        status: string;
        total: number;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        orderId: string | null;
        customerId: string | null;
        paidAmount: number;
        balance: number;
        dueDate: Date | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
    createAudit(tx: Tx, data: {
        paymentId: string;
        invoiceId: string;
        customerId: string | null;
    }): Prisma.Prisma__AuditLogClient<{
        id: string;
        action: string;
        createdAt: Date;
        entity: string | null;
        entityId: string | null;
        userId: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
}
export {};
