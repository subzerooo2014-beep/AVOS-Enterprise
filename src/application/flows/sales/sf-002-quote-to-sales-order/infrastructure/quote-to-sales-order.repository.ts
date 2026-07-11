import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../../../../prisma/prisma.service";

type Tx = Prisma.TransactionClient;

@Injectable()
export class QuoteToSalesOrderRepository {
  constructor(private readonly prisma: PrismaService) {}

  transaction<T>(fn: (tx: Tx) => Promise<T>) {
    return this.prisma.$transaction(fn);
  }

  findQuote(tx: Tx, quoteId: string) {
    return tx.quote.findUnique({
      where: { id: quoteId },
      include: { order: true },
    });
  }

  createSalesOrder(
    tx: Tx,
    data: {
      customerId: string;
      totalAmount: number;
    },
  ) {
    return tx.salesOrder.create({
      data: {
        customerId: data.customerId,
        status: "DRAFT",
        totalAmount: data.totalAmount,
      },
    });
  }

  createLegacyOrder(
    tx: Tx,
    data: {
      quoteId: string;
      customerId: string;
      total: number;
      notes?: string;
    },
  ) {
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

  markQuoteApproved(tx: Tx, quoteId: string) {
    return tx.quote.update({
      where: { id: quoteId },
      data: { status: "APPROVED" },
    });
  }

  createAudit(
    tx: Tx,
    data: {
      quoteId: string;
      salesOrderId: string;
      customerId: string;
    },
  ) {
    return tx.auditLog.create({
      data: {
        action: "QUOTE_CONVERTED_TO_SALES_ORDER",
        entity: "SalesOrder",
        entityId: data.salesOrderId,
        userId: data.customerId,
      },
    });
  }
}
