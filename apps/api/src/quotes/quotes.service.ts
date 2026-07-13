import {
  BadRequestException,
  ConflictException,
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
export class QuotesService {
  constructor(private readonly prisma: PrismaService) {}

  private delegate(client: unknown = this.prisma) {
    return delegateOrThrow(client, "quote");
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
    if (!item) throw new NotFoundException("Quote not found");
    return item;
  }

  create(dto: any) {
    return this.delegate().create({
      data: cleanFlowData({
        ...dto,
        number: dto?.number ?? createBusinessNumber("QUOTE"),
        status: dto?.status ?? "DRAFT",
        total: asMoney(dto?.total, "total"),
      }),
    });
  }

  async update(id: string, dto: any) {
    const quote = await this.findOne(id);
    ensureTransition(quote.status, ["DRAFT", "REJECTED"], "UPDATED");

    return this.delegate().update({
      where: { id },
      data: cleanFlowData({
        ...dto,
        total: dto?.total !== undefined ? asMoney(dto.total, "total") : undefined,
      }),
    });
  }

  async changeStatus(id: string, status: string, allowed: string[]) {
    const quote = await this.findOne(id);
    ensureTransition(quote.status, allowed, status);
    return this.delegate().update({ where: { id }, data: { status } });
  }

  submit(id: string) {
    return this.changeStatus(id, "SUBMITTED", ["DRAFT", "REJECTED"]);
  }

  approve(id: string) {
    return this.changeStatus(id, "APPROVED", ["SUBMITTED"]);
  }

  reject(id: string) {
    return this.changeStatus(id, "REJECTED", ["SUBMITTED"]);
  }

  async convertToOrder(id: string, dto: any = {}) {
    const key = resolveIdempotencyKey(dto?.idempotencyKey, [
      "quote-to-order",
      id,
      dto?.customerId,
    ]);
    const completed = readCompletedOperation(key);
    if (completed) return completed;

    const transaction = (this.prisma as any).$transaction;
    if (typeof transaction !== "function") {
      throw new BadRequestException("Prisma transactions are not available.");
    }

    const result = await transaction.call(this.prisma, async (tx: any) => {
      const quote = await this.findOne(id, tx);
      ensureTransition(quote.status, ["APPROVED"], "CONVERTED");

      const orderDelegate = delegateOrThrow(tx, "order");
      const existing = dto?.orderId
        ? await orderDelegate.findUnique({ where: { id: dto.orderId } })
        : null;
      if (existing) {
        throw new ConflictException("Target order already exists.");
      }

      const order = await orderDelegate.create({
        data: cleanFlowData({
          number: dto?.number ?? createBusinessNumber("ORDER"),
          customerId: dto?.customerId ?? quote.customerId,
          quoteId: dto?.quoteId ?? quote.id,
          status: dto?.status ?? "PENDING",
          total: asMoney(dto?.total ?? quote.total, "total"),
          notes: dto?.notes,
        }),
      });

      await this.delegate(tx).update({
        where: { id },
        data: { status: "CONVERTED" },
      });

      return { quoteId: id, order };
    });

    return rememberCompletedOperation(key, "quote-to-order", result);
  }

  async remove(id: string) {
    const quote = await this.findOne(id);
    ensureTransition(quote.status, ["DRAFT", "REJECTED"], "DELETED");
    await this.delegate().delete({ where: { id } });
    return { deleted: true, id };
  }
}
