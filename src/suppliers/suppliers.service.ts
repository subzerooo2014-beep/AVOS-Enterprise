import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateSupplierDto } from "./dto/create-supplier.dto";
import { UpdateSupplierDto } from "./dto/update-supplier.dto";

@Injectable()
export class SuppliersService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return (this.prisma as any)["suppliers"].findMany();
  }

  async findOne(id: string) {
    const item = await (this.prisma as any)["suppliers"].findUnique({ where: { id } });
    if (!item) throw new NotFoundException("Supplier not found");
    return item;
  }

  create(dto: CreateSupplierDto) {
    return (this.prisma as any)["suppliers"].create({ data: dto });
  }

  async update(id: string, dto: UpdateSupplierDto) {
    await this.findOne(id);
    return (this.prisma as any)["suppliers"].update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    await (this.prisma as any)["suppliers"].delete({ where: { id } });
    return { deleted: true };
  }
}
