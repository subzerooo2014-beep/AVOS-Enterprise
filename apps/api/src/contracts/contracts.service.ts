import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ContractsService {
  constructor(private readonly prisma: PrismaService) {}

  private delegate() {
    const client = this.prisma as any;
    if (!client.contract) throw new BadRequestException("Prisma delegate 'contract' is not available.");
    return client.contract;
  }

  private clean(data: any) {
    const out: any = {};
    for (const [key, value] of Object.entries(data ?? {})) {
      if (value !== undefined && value !== null && value !== "") out[key] = value;
    }
    return out;
  }

  private number() {
    return `CONTRACT-${Date.now()}`;
  }

  findAll(query: any = {}) {
    const where: any = {};
    if (query.status) where.status = query.status;
    if (query.customerId) where.customerId = query.customerId;

    return this.delegate().findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: query.take ? Number(query.take) : 100,
    });
  }

  async findOne(id: string) {
    const item = await this.delegate().findUnique({ where: { id } });
    if (!item) throw new NotFoundException("Contract not found");
    return item;
  }

  create(dto: any) {
    return this.delegate().create({
      data: this.clean({
        ...dto,
        number: dto?.number ?? this.number(),
        status: dto?.status ?? "DRAFT",
        total: Number(dto?.total ?? 0),
      }),
    });
  }

  async update(id: string, dto: any) {
    await this.findOne(id);
    return this.delegate().update({
      where: { id },
      data: this.clean({
        ...dto,
        total: dto?.total !== undefined ? Number(dto.total) : undefined,
      }),
    });
  }

  async activate(id: string) {
    await this.findOne(id);
    return this.delegate().update({ where: { id }, data: { status: "ACTIVE" } });
  }

  async complete(id: string) {
    await this.findOne(id);
    return this.delegate().update({ where: { id }, data: { status: "COMPLETED" } });
  }

  async cancel(id: string) {
    await this.findOne(id);
    return this.delegate().update({ where: { id }, data: { status: "CANCELLED" } });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.delegate().delete({ where: { id } });
    return { deleted: true };
  }
}
