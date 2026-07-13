import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import {
  cleanFlowData,
  createBusinessNumber,
  delegateOrThrow,
  ensureTransition,
} from "../core-application-flows/core-flow.utils";

@Injectable()
export class ReservationsService {
  constructor(private readonly prisma: PrismaService) {}

  private delegate(client: unknown = this.prisma) {
    return delegateOrThrow(client, "reservation");
  }

  findAll(query: any = {}) {
    const where: any = {};
    if (query.status) where.status = query.status;
    if (query.vehicleId) where.vehicleId = query.vehicleId;
    if (query.customerId) where.customerId = query.customerId;

    return this.delegate().findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: Math.min(Math.max(Number(query.take ?? 100), 1), 250),
    });
  }

  async findOne(id: string, client: unknown = this.prisma) {
    const reservation = await this.delegate(client).findUnique({ where: { id } });
    if (!reservation) throw new NotFoundException("Reservation not found");
    return reservation;
  }

  async create(dto: any) {
    const vehicleId = String(dto?.vehicleId ?? "").trim();
    if (!vehicleId) throw new BadRequestException("vehicleId is required.");

    const active = await this.delegate().findFirst({
      where: {
        vehicleId,
        status: { in: ["PENDING", "CONFIRMED"] },
      },
    });
    if (active) {
      throw new ConflictException("Vehicle already has an active reservation.");
    }

    const expiresAt = dto?.expiresAt
      ? new Date(dto.expiresAt)
      : new Date(Date.now() + 30 * 60 * 1000);

    return this.delegate().create({
      data: cleanFlowData({
        ...dto,
        number: dto?.number ?? createBusinessNumber("RES"),
        status: dto?.status ?? "PENDING",
        expiresAt,
      }),
    });
  }

  async changeStatus(id: string, status: string, allowed: string[], extra: any = {}) {
    const reservation = await this.findOne(id);
    ensureTransition(reservation.status, allowed, status);
    return this.delegate().update({
      where: { id },
      data: cleanFlowData({ status, ...extra }),
    });
  }

  confirm(id: string) {
    return this.changeStatus(id, "CONFIRMED", ["PENDING"], {
      confirmedAt: new Date(),
    });
  }

  cancel(id: string, dto: any = {}) {
    return this.changeStatus(id, "CANCELLED", ["PENDING", "CONFIRMED"], {
      cancelledAt: new Date(),
      cancellationReason: dto?.reason,
    });
  }

  release(id: string, dto: any = {}) {
    return this.changeStatus(id, "RELEASED", ["PENDING", "CONFIRMED"], {
      releasedAt: new Date(),
      releaseReason: dto?.reason,
    });
  }

  async expireDue() {
    const result = await this.delegate().updateMany({
      where: {
        status: { in: ["PENDING", "CONFIRMED"] },
        expiresAt: { lt: new Date() },
      },
      data: {
        status: "EXPIRED",
      },
    });

    return {
      success: true,
      expired: Number(result?.count ?? 0),
      executedAt: new Date().toISOString(),
    };
  }
}
