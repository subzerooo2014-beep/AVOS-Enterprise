import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { BaseRepository } from "../../common/repositories/base.repository";

@Injectable()
export class VehiclesRepository extends BaseRepository {
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  private normalizePage(value?: number) {
    return Math.max(Number(value || 1), 1);
  }

  private normalizeLimit(value?: number) {
    return Math.min(Math.max(Number(value || 20), 1), 100);
  }

  private safeSort(sort?: string) {
    const allowed = ["createdAt", "updatedAt", "vin", "make", "model", "year", "status", "location"];
    return allowed.includes(sort || "") ? sort : "createdAt";
  }

  async findPage(query: {
    page?: number;
    limit?: number;
    search?: string;
    make?: string;
    model?: string;
    year?: number;
    color?: string;
    status?: string;
    location?: string;
    sort?: string;
    order?: "asc" | "desc";
  }) {
    const page = this.normalizePage(query.page);
    const limit = this.normalizeLimit(query.limit);

    const where: any = {};

    if (query.make) where.make = { contains: query.make };
    if (query.model) where.model = { contains: query.model };
    if (query.year) where.year = query.year;
    if (query.color) where.color = { contains: query.color };
    if (query.status) where.status = query.status;
    if (query.location) where.location = { contains: query.location };

    if (query.search) {
      where.OR = [
        { vin: { contains: query.search } },
        { make: { contains: query.search } },
        { model: { contains: query.search } },
        { color: { contains: query.search } },
        { location: { contains: query.search } },
      ];
    }

    const sort = this.safeSort(query.sort);
    const order = query.order === "asc" ? "asc" : "desc";

    const [items, total] = await Promise.all([
      (this.prisma as any).vehicle.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sort as string]: order },
      }),
      (this.prisma as any).vehicle.count({ where }),
    ]);

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPreviousPage: page > 1,
      },
    };
  }

  findByVin(vin: string) {
    return (this.prisma as any).vehicle.findUnique({ where: { vin } });
  }

  findById(id: string) {
    return (this.prisma as any).vehicle.findUnique({ where: { id } });
  }

  create(data: any) {
    return (this.prisma as any).vehicle.create({
      data: {
        ...data,
        status: data.status ?? "AVAILABLE",
      },
    });
  }

  update(id: string, data: any) {
    return (this.prisma as any).vehicle.update({
      where: { id },
      data,
    });
  }

  delete(id: string) {
    return (this.prisma as any).vehicle.delete({
      where: { id },
    });
  }

  async stats() {
    const [total, available, sold, reserved] = await Promise.all([
      (this.prisma as any).vehicle.count(),
      (this.prisma as any).vehicle.count({ where: { status: "AVAILABLE" } }),
      (this.prisma as any).vehicle.count({ where: { status: "SOLD" } }),
      (this.prisma as any).vehicle.count({ where: { status: "RESERVED" } }),
    ]);

    return {
      total,
      available,
      sold,
      reserved,
      generatedAt: new Date().toISOString(),
    };
  }
}
