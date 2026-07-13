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
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  private delegate(client: unknown = this.prisma) {
    return delegateOrThrow(client, "order");
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
    if (!item) throw new NotFoundException("Order not found");
    return item;
  }

  create(dto: any) {
    return this.delegate().create({
      data: cleanFlowData({
        ...dto,
        number: dto?.number ?? createBusinessNumber("ORDER"),
        status: dto?.status ?? "PENDING",
        total: asMoney(dto?.total, "total"),
      }),
    });
  }

  async update(id: string, dto: any) {
    const order = await this.findOne(id);
    ensureTransition(order.status, ["PENDING", "DRAFT"], "UPDATED");
    return this.delegate().update({
      where: { id },
      data: cleanFlowData({
        ...dto,
        total: dto?.total !== undefined ? asMoney(dto.total, "total") : undefined,
      }),
    });
  }

  async changeStatus(id: string, status: string, allowed: string[]) {
    const order = await this.findOne(id);
    ensureTransition(order.status, allowed, status);
    return this.delegate().update({ where: { id }, data: { status } });
  }

  confirm(id: string) {
    return this.changeStatus(id, "CONFIRMED", ["PENDING", "DRAFT"]);
  }

  cancel(id: string) {
    return this.changeStatus(id, "CANCELLED", ["PENDING", "DRAFT", "CONFIRMED"]);
  }

  async createInvoice(id: string, dto: any = {}) {
    const key = resolveIdempotencyKey(dto?.idempotencyKey, [
      "order-to-invoice",
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
      const order = await this.findOne(id, tx);
      ensureTransition(order.status, ["CONFIRMED", "APPROVED"], "INVOICED");

      const invoiceDelegate = delegateOrThrow(tx, "invoice");
      const invoice = await invoiceDelegate.create({
        data: cleanFlowData({
          number: dto?.number ?? createBusinessNumber("INV"),
          orderId: dto?.orderId ?? order.id,
          customerId: dto?.customerId ?? order.customerId,
          status: dto?.status ?? "PENDING",
          total: asMoney(dto?.total ?? order.total, "total"),
          dueDate: dto?.dueDate,
          notes: dto?.notes,
        }),
      });

      await this.delegate(tx).update({
        where: { id },
        data: { status: "INVOICED" },
      });

      return { orderId: id, invoice };
    });

    return rememberCompletedOperation(key, "order-to-invoice", result);
  }

  async remove(id: string) {
    const order = await this.findOne(id);
    ensureTransition(order.status, ["PENDING", "DRAFT", "CANCELLED"], "DELETED");
    await this.delegate().delete({ where: { id } });
    return { deleted: true, id };
  }
}
