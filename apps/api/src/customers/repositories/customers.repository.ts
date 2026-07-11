import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { BaseRepository } from "../../common/repositories/base.repository";

@Injectable()
export class CustomersRepository extends BaseRepository {
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  findCustomers(where: any = {}) {
    return (this.prisma as any).customer.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
  }

  paginateCustomers(page = 1, limit = 20, where: any = {}) {
    return this.paginate((this.prisma as any).customer, { where }, page, limit);
  }

  findCustomerById(id: string) {
    return (this.prisma as any).customer.findUnique({
      where: { id },
    });
  }

  createCustomer(data: any) {
    return (this.prisma as any).customer.create({
      data,
    });
  }

  updateCustomer(id: string, data: any) {
    return (this.prisma as any).customer.update({
      where: { id },
      data,
    });
  }

  deleteCustomer(id: string) {
    return (this.prisma as any).customer.delete({
      where: { id },
    });
  }

  countCustomers(where: any = {}) {
    return (this.prisma as any).customer.count({
      where,
    });
  }
}
