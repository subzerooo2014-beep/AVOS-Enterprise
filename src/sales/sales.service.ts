import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { SalesMapper } from "./mappers/sales.mapper";
import { SalesPolicy, SaleStatus } from "./policies/sales.policy";
import { buildSalesWhere, normalizeSalesPaging } from "./helpers/sales-query.helper";
import { createSalesNumber } from "./helpers/sales-number.helper";

@Injectable()
export class SalesService {
  constructor(private readonly prisma: PrismaService) {}

  private saleDelegate() {
    const client = this.prisma as any;
    if (!client.sale) {
      throw new BadRequestException("Prisma delegate 'sale' is not available. Run pnpm prisma generate.");
    }
    return client.sale;
  }

  async findAll(query: any = {}) {
    const delegate = this.saleDelegate();
    const { page, limit, skip, take } = normalizeSalesPaging(query);
    const where = buildSalesWhere(query);

    const [items, total] = await Promise.all([
      delegate.findMany({ where, skip, take, orderBy: { createdAt: "desc" } }),
      delegate.count({ where }),
    ]);

    return {
      items,
      meta: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string) {
    const sale = await this.saleDelegate().findUnique({ where: { id } });
    SalesPolicy.ensureExists(sale);
    return sale;
  }

  async create(dto: any) {
    const data = SalesMapper.toCreate({
      ...dto,
      number: dto?.number ?? createSalesNumber(),
    });

    return this.saleDelegate().create({ data });
  }

  async update(id: string, dto: any) {
    const sale = await this.findOne(id);
    SalesPolicy.ensureCanUpdate(sale);

    return this.saleDelegate().update({
      where: { id },
      data: SalesMapper.toUpdate(dto),
    });
  }

  async changeStatus(id: string, status: SaleStatus) {
    SalesPolicy.ensureValidStatus(status);
    await this.findOne(id);

    return this.saleDelegate().update({
      where: { id },
      data: { status },
    });
  }

  async submit(id: string) {
    return this.changeStatus(id, "PENDING_APPROVAL");
  }

  async approve(id: string) {
    return this.changeStatus(id, "APPROVED");
  }

  async closeWon(id: string) {
    return this.changeStatus(id, "WON");
  }

  async closeLost(id: string) {
    return this.changeStatus(id, "LOST");
  }

  async cancel(id: string) {
    return this.changeStatus(id, "CANCELLED");
  }

  async close(id: string) {
    return this.changeStatus(id, "CLOSED");
  }

  async remove(id: string) {
    const sale = await this.findOne(id);
    SalesPolicy.ensureCanDelete(sale);
    return this.saleDelegate().delete({ where: { id } });
  }

  async dashboard() {
    const delegate = this.saleDelegate();

    const [
      totalSales,
      openSales,
      draftSales,
      pendingSales,
      approvedSales,
      wonSales,
      lostSales,
      cancelledSales,
      closedSales,
    ] = await Promise.all([
      delegate.count(),
      delegate.count({ where: { status: "OPEN" } }),
      delegate.count({ where: { status: "DRAFT" } }),
      delegate.count({ where: { status: "PENDING_APPROVAL" } }),
      delegate.count({ where: { status: "APPROVED" } }),
      delegate.count({ where: { status: "WON" } }),
      delegate.count({ where: { status: "LOST" } }),
      delegate.count({ where: { status: "CANCELLED" } }),
      delegate.count({ where: { status: "CLOSED" } }),
    ]);

    return {
      totalSales,
      openSales,
      draftSales,
      pendingSales,
      approvedSales,
      wonSales,
      lostSales,
      cancelledSales,
      closedSales,
      activeSales: openSales + draftSales + pendingSales + approvedSales,
      winRate: totalSales ? Number(((wonSales / totalSales) * 100).toFixed(2)) : 0,
    };
  }
}
