import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../../../../prisma/prisma.service";

type Tx = Prisma.TransactionClient;

@Injectable()
export class OrderToInvoiceRepository {
  constructor(private readonly prisma: PrismaService) {}

  transaction<T>(fn: (tx: Tx) => Promise<T>) {
    return this.prisma.$transaction(fn);
  }

  findOrder(tx: Tx, orderId: string) {
    return tx.order.findUnique({
      where: { id: orderId },
      include: { invoice: true },
    });
  }

  createInvoice(
    tx: Tx,
    data: {
      number: string;
      total: number;
      customerId: string | null;
      orderId: string;
      notes?: string;
    },
  ) {
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

  markOrderInvoiced(tx: Tx, orderId: string) {
    return tx.order.update({
      where: { id: orderId },
      data: { status: "INVOICED" },
    });
  }

  createAudit(
    tx: Tx,
    data: {
      invoiceId: string;
      customerId: string | null;
    },
  ) {
    return tx.auditLog.create({
      data: {
        action: "INVOICE_CREATED",
        entity: "Invoice",
        entityId: data.invoiceId,
        userId: data.customerId,
      },
    });
  }
}
