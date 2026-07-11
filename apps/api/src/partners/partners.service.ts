import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class PartnersService {
  constructor(private prisma: PrismaService) {}

  create(data: any) {
    return (this.prisma as any).partnerCompany.create({ data });
  }

  findAll() {
    return (this.prisma as any).partnerCompany.findMany({ orderBy: { createdAt: "desc" } });
  }

  async findOne(id: string) {
    const item = await (this.prisma as any).partnerCompany.findUnique({ where: { id } });
    if (!item) throw new NotFoundException("Partner company not found");
    return item;
  }

  async update(id: string, data: any) {
    await this.findOne(id);
    return (this.prisma as any).partnerCompany.update({ where: { id }, data });
  }
}
