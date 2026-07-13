import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import {
  asMoney,
  cleanFlowData,
  createBusinessNumber,
  delegateOrThrow,
  ensureTransition,
  readCompletedOperation,
  rememberCompletedOperation,
  resolveIdempotencyKey,
} from "../core-application-flows/core-flow.utils";

@Injectable()
export class InvoicesService {
  constructor(private readonly prisma: PrismaService) {}

  private delegate(client: unknown = this.prisma) {
    return delegateOrThrow(client, "invoice");
  }

  findAll(query: any = {}) {
    const where: any = {};
    if (query.status) where.status = query.status;
    if (query.customerId) where.customerId = query.customerId;

    return this.delegate().findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: Math.min(Math.max(Number(query.take ?? 100), 1), 250),
    });
  }

  async findOne(id: string, client: unknown = this.prisma) {
    const item = await this.delegate(client).findUnique({ where: { id } });
    if (!item) throw new NotFoundException("Invoice not found");
    return item;
  }

  create(dto: any) {
    return this.delegate().create({
      data: cleanFlowData({
        ...dto,
        number: dto?.number ?? createBusinessNumber("INV"),
        status: dto?.status ?? "DRAFT",
        total: asMoney(dto?.total, "total"),
      }),
    });
  }

  async update(id: string, dto: any) {
    const invoice = await this.findOne(id);
    ensureTransition(invoice.status, ["DRAFT", "PENDING"], "UPDATED");
    return this.delegate().update({
      where: { id },
      data: cleanFlowData({
        ...dto,
        total: dto?.total !== undefined ? asMoney(dto.total, "total") : undefined,
      }),
    });
  }

  async changeStatus(id: string, status: string, allowed: string[]) {
    const invoice = await this.findOne(id);
    ensureTransition(invoice.status, allowed, status);
    return this.delegate().update({ where: { id }, data: { status } });
  }

  issue(id: string) {
    return this.changeStatus(id, "PENDING", ["DRAFT"]);
  }

  cancel(id: string) {
    return this.changeStatus(id, "CANCELLED", ["DRAFT", "PENDING"]);
  }

  async registerPayment(id: string, dto: any = {}) {
    const amount = asMoney(dto?.amount, "amount");
    if (amount <= 0) {
      throw new BadRequestException("amount must be greater than zero.");
    }

    const key = resolveIdempotencyKey(dto?.idempotencyKey, [
      "invoice-to-payment",
      id,
      amount,
      dto?.reference,
    ]);
    const completed = readCompletedOperation(key);
    if (completed) return completed;

    const transaction = (this.prisma as any).$transaction;
    if (typeof transaction !== "function") {
      throw new BadRequestException("Prisma transactions are not available.");
    }

    const result = await transaction.call(this.prisma, async (tx: any) => {
      const invoice = await this.findOne(id, tx);
      ensureTransition(invoice.status, ["PENDING", "PARTIALLY_PAID"], "PAID");

      const paymentDelegate = delegateOrThrow(tx, "payment");
      const payment = await paymentDelegate.create({
        data: cleanFlowData({
          number: dto?.number ?? createBusinessNumber("PAY"),
          invoiceId: dto?.invoiceId ?? invoice.id,
          customerId: dto?.customerId ?? invoice.customerId,
          amount,
          method: dto?.method,
          reference: dto?.reference,
          status: dto?.status ?? "COMPLETED",
          paidAt: dto?.paidAt ?? new Date(),
        }),
      });

      const total = asMoney(invoice.total, "invoice total");
      const alreadyPaid = asMoney(invoice.paidAmount ?? 0, "paid amount");
      const nextPaid = alreadyPaid + amount;
      const nextStatus = nextPaid >= total ? "PAID" : "PARTIALLY_PAID";

      await this.delegate(tx).update({
        where: { id },
        data: cleanFlowData({
          status: nextStatus,
          paidAmount: nextPaid,
        }),
      });

      return { invoiceId: id, payment, invoiceStatus: nextStatus };
    });

    return rememberCompletedOperation(key, "invoice-to-payment", result);
  }

  async remove(id: string) {
    const invoice = await this.findOne(id);
    ensureTransition(invoice.status, ["DRAFT", "CANCELLED"], "DELETED");
    await this.delegate().delete({ where: { id } });
    return { deleted: true, id };
  }
}
