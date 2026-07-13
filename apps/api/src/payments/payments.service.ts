import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
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
export class PaymentsService {
  constructor(private readonly prisma: PrismaService) {}

  private delegate(client: unknown = this.prisma) {
    return delegateOrThrow(client, "payment");
  }

  findAll(query: any = {}) {
    const where: any = {};
    if (query.status) where.status = query.status;
    if (query.invoiceId) where.invoiceId = query.invoiceId;

    return this.delegate().findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: Math.min(Math.max(Number(query.take ?? 100), 1), 250),
    });
  }

  async findOne(id: string, client: unknown = this.prisma) {
    const item = await this.delegate(client).findUnique({ where: { id } });
    if (!item) throw new NotFoundException("Payment not found");
    return item;
  }

  create(dto: any) {
    const amount = asMoney(dto?.amount, "amount");
    if (amount <= 0) {
      throw new BadRequestException("amount must be greater than zero.");
    }

    return this.delegate().create({
      data: cleanFlowData({
        ...dto,
        number: dto?.number ?? createBusinessNumber("PAY"),
        amount,
        status: dto?.status ?? "PENDING",
      }),
    });
  }

  async update(id: string, dto: any) {
    const payment = await this.findOne(id);
    ensureTransition(payment.status, ["PENDING"], "UPDATED");
    return this.delegate().update({
      where: { id },
      data: cleanFlowData({
        ...dto,
        amount: dto?.amount !== undefined ? asMoney(dto.amount, "amount") : undefined,
      }),
    });
  }

  async refund(id: string, dto: any = {}) {
    const payment = await this.findOne(id);
    ensureTransition(payment.status, ["COMPLETED", "PAID"], "REFUNDED");

    const refundAmount = asMoney(dto?.amount ?? payment.amount, "refund amount");
    if (refundAmount <= 0 || refundAmount > Number(payment.amount ?? 0)) {
      throw new BadRequestException("Invalid refund amount.");
    }

    const key = resolveIdempotencyKey(dto?.idempotencyKey, [
      "payment-refund",
      id,
      refundAmount,
    ]);
    const completed = readCompletedOperation(key);
    if (completed) return completed;

    const updated = await this.delegate().update({
      where: { id },
      data: cleanFlowData({
        status: refundAmount === Number(payment.amount) ? "REFUNDED" : "PARTIALLY_REFUNDED",
        refundedAmount: refundAmount,
        refundReason: dto?.reason,
        refundedAt: new Date(),
      }),
    });

    return rememberCompletedOperation(key, "payment-refund", updated);
  }

  async remove(id: string) {
    const payment = await this.findOne(id);
    ensureTransition(payment.status, ["PENDING", "FAILED", "CANCELLED"], "DELETED");
    await this.delegate().delete({ where: { id } });
    return { deleted: true, id };
  }
}
