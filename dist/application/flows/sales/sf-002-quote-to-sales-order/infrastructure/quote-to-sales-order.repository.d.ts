import { Prisma } from "@prisma/client";
import { PrismaService } from "../../../../../prisma/prisma.service";
type Tx = Prisma.TransactionClient;
export declare class QuoteToSalesOrderRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    transaction<T>(fn: (tx: Tx) => Promise<T>): Promise<T>;
    findQuote(tx: Tx, quoteId: string): Prisma.Prisma__QuoteClient<({
        order: {
            number: string | null;
            id: string;
            status: string;
            total: number;
            createdAt: Date;
            updatedAt: Date;
            notes: string | null;
            customerId: string | null;
            quoteId: string | null;
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
        validUntil: Date | null;
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
    createSalesOrder(tx: Tx, data: {
        customerId: string;
        totalAmount: number;
    }): Prisma.Prisma__SalesOrderClient<{
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        customerId: string;
        totalAmount: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
    createLegacyOrder(tx: Tx, data: {
        quoteId: string;
        customerId: string;
        total: number;
        notes?: string;
    }): Prisma.Prisma__OrderClient<{
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
    markQuoteApproved(tx: Tx, quoteId: string): Prisma.Prisma__QuoteClient<{
        number: string | null;
        id: string;
        status: string;
        total: number;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        customerId: string | null;
        validUntil: Date | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
    createAudit(tx: Tx, data: {
        quoteId: string;
        salesOrderId: string;
        customerId: string;
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
