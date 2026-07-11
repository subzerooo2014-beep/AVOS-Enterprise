import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../../../../prisma/prisma.service";

type Tx = Prisma.TransactionClient;

@Injectable()
export class ReceivePaymentRepository {
  constructor(private readonly prisma: PrismaService) {}

  transaction<T>(fn: (tx: Tx) => Promise<T>) {
    return this.prisma.$transaction(fn);
  }

  findInvoice(tx: Tx, invoiceId: string) {
    return tx.invoice.findUnique({
      where: { id: invoiceId },
    });
  }

  createPayment(
    tx: Tx,
    data: {
      invoiceId: string;
      orderId: string | null;
      customerId: string | null;
      amount: number;
      method?: string;
      reference?: string;
      notes?: string;
    },
  ) {
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

  updateInvoicePaymentState(
    tx: Tx,
    data: {
      invoiceId: string;
      paidAmount: number;
      balance: number;
      status: string;
    },
  ) {
    return tx.invoice.update({
      where: { id: data.invoiceId },
      data: {
        paidAmount: data.paidAmount,
        balance: data.balance,
        status: data.status,
      },
    });
  }

  createAudit(
    tx: Tx,
    data: {
      paymentId: string;
      invoiceId: string;
      customerId: string | null;
    },
  ) {
    return tx.auditLog.create({
      data: {
        action: "PAYMENT_RECEIVED",
        entity: "Payment",
        entityId: data.paymentId,
        userId: data.customerId,
      },
    });
  }
}
