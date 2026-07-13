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
export class InventoryService {
  constructor(private readonly prisma: PrismaService) {}

  private delegate(client: unknown = this.prisma) {
    return delegateOrThrow(client, "inventory");
  }

  findAll(query: any = {}) {
    const where: any = {};
    if (query.status) where.status = query.status;
    if (query.vehicleId) where.vehicleId = query.vehicleId;
    if (query.warehouseId) where.warehouseId = query.warehouseId;

    return this.delegate().findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: Math.min(Math.max(Number(query.take ?? 100), 1), 250),
    });
  }

  async findOne(id: string, client: unknown = this.prisma) {
    const item = await this.delegate(client).findUnique({ where: { id } });
    if (!item) throw new NotFoundException("Inventory item not found");
    return item;
  }

  create(dto: any) {
    return this.delegate().create({
      data: cleanFlowData({
        ...dto,
        number: dto?.number ?? createBusinessNumber("STOCK"),
        status: dto?.status ?? "AVAILABLE",
        quantity: Number(dto?.quantity ?? 1),
        reservedQuantity: Number(dto?.reservedQuantity ?? 0),
      }),
    });
  }

  async update(id: string, dto: any) {
    const item = await this.findOne(id);
    ensureTransition(item.status, ["AVAILABLE", "RESERVED", "IN_TRANSIT"], "UPDATED");
    return this.delegate().update({
      where: { id },
      data: cleanFlowData(dto),
    });
  }

  async reserve(id: string, dto: any = {}) {
    const quantity = Math.max(Number(dto?.quantity ?? 1), 1);
    const key = resolveIdempotencyKey(dto?.idempotencyKey, ["inventory-reserve", id, quantity]);
    const completed = readCompletedOperation(key);
    if (completed) return completed;

    const item = await this.findOne(id);
    ensureTransition(item.status, ["AVAILABLE", "PARTIALLY_RESERVED"], "RESERVED");

    const available = Number(item.quantity ?? 1) - Number(item.reservedQuantity ?? 0);
    if (available < quantity) {
      throw new ConflictException("Insufficient available inventory.");
    }

    const reservedQuantity = Number(item.reservedQuantity ?? 0) + quantity;
    const status = reservedQuantity >= Number(item.quantity ?? 1)
      ? "RESERVED"
      : "PARTIALLY_RESERVED";

    const updated = await this.delegate().update({
      where: { id },
      data: cleanFlowData({
        reservedQuantity,
        status,
        reservationId: dto?.reservationId,
        reservedAt: new Date(),
      }),
    });

    return rememberCompletedOperation(key, "inventory-reserve", updated);
  }

  async release(id: string, dto: any = {}) {
    const quantity = Math.max(Number(dto?.quantity ?? 1), 1);
    const key = resolveIdempotencyKey(dto?.idempotencyKey, ["inventory-release", id, quantity]);
    const completed = readCompletedOperation(key);
    if (completed) return completed;

    const item = await this.findOne(id);
    ensureTransition(item.status, ["RESERVED", "PARTIALLY_RESERVED"], "AVAILABLE");

    const reservedQuantity = Math.max(Number(item.reservedQuantity ?? 0) - quantity, 0);
    const status = reservedQuantity === 0 ? "AVAILABLE" : "PARTIALLY_RESERVED";

    const updated = await this.delegate().update({
      where: { id },
      data: cleanFlowData({
        reservedQuantity,
        status,
        reservationId: reservedQuantity === 0 ? null : item.reservationId,
        releasedAt: new Date(),
        releaseReason: dto?.reason,
      }),
    });

    return rememberCompletedOperation(key, "inventory-release", updated);
  }

  async markSold(id: string, dto: any = {}) {
    const key = resolveIdempotencyKey(dto?.idempotencyKey, ["inventory-sold", id, dto?.saleId]);
    const completed = readCompletedOperation(key);
    if (completed) return completed;

    const item = await this.findOne(id);
    ensureTransition(item.status, ["AVAILABLE", "RESERVED", "PARTIALLY_RESERVED"], "SOLD");

    const updated = await this.delegate().update({
      where: { id },
      data: cleanFlowData({
        status: "SOLD",
        saleId: dto?.saleId,
        soldAt: new Date(),
        salePrice: dto?.salePrice !== undefined ? asMoney(dto.salePrice, "salePrice") : undefined,
      }),
    });

    return rememberCompletedOperation(key, "inventory-sold", updated);
  }

  async dashboard() {
    const delegate = this.delegate();
    const statuses = ["AVAILABLE", "RESERVED", "PARTIALLY_RESERVED", "SOLD", "IN_TRANSIT"];
    const counts = await Promise.all(
      statuses.map((status) => delegate.count({ where: { status } })),
    );

    return {
      total: counts.reduce((sum, value) => sum + Number(value ?? 0), 0),
      byStatus: Object.fromEntries(statuses.map((status, index) => [status, counts[index]])),
      generatedAt: new Date().toISOString(),
    };
  }

  async remove(id: string) {
    const item = await this.findOne(id);
    ensureTransition(item.status, ["AVAILABLE", "CANCELLED"], "DELETED");
    await this.delegate().delete({ where: { id } });
    return { deleted: true, id };
  }
}
