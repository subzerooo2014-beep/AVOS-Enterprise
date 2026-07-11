import { Prisma } from "@prisma/client";
import { PrismaService } from "../../../../../prisma/prisma.service";
type Tx = Prisma.TransactionClient;
export declare class OrderToInvoiceRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    transaction<T>(fn: (tx: Tx) => Promise<T>): Promise<T>;
    findOrder(tx: Tx, orderId: string): Prisma.Prisma__OrderClient<({
        invoice: {
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
        } | null;
    } & {
        number: string | null;
        id: string;
        status: string;
        total: number;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        customerId: string | null;
        quoteId: string | null;
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
    createInvoice(tx: Tx, data: {
        number: string;
        total: number;
        customerId: string | null;
        orderId: string;
        notes?: string;
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
    markOrderInvoiced(tx: Tx, orderId: string): Prisma.Prisma__OrderClient<{
        number: string | null;
        id: string;
        status: string;
        total: number;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        customerId: string | null;
        quoteId: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
    createAudit(tx: Tx, data: {
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
