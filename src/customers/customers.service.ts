import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return (this.prisma as any)["customer"].findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  async findOne(id: string) {
    const item = await (this.prisma as any)["customer"].findUnique({ where: { id } });
    if (!item) throw new NotFoundException("Customers item not found");
    return item;
  }

  create(dto: any) {
    return (this.prisma as any)["customer"].create({ data: dto });
  }

  async update(id: string, dto: any) {
    await this.findOne(id);
    return (this.prisma as any)["customer"].update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    await (this.prisma as any)["customer"].delete({ where: { id } });
    return { deleted: true };
  }
}
