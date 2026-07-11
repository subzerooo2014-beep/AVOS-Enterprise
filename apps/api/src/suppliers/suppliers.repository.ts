import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateSupplierDto } from "./dto/create-supplier.dto";
import { UpdateSupplierDto } from "./dto/update-supplier.dto";
import { SUPPLIERS_MODEL } from "./constants/suppliers.constants";

@Injectable()
export class SuppliersRepository {
  constructor(private readonly prisma: PrismaService) {}

  private get model() {
    return (this.prisma as any)[SUPPLIERS_MODEL];
  }

  findAll() {
    return this.model.findMany({ orderBy: { createdAt: "desc" } });
  }

  findById(id: string) {
    return this.model.findUnique({ where: { id } });
  }

  create(dto: CreateSupplierDto) {
    return this.model.create({ data: dto });
  }

  update(id: string, dto: UpdateSupplierDto) {
    return this.model.update({ where: { id }, data: dto });
  }

  remove(id: string) {
    return this.model.delete({ where: { id } });
  }
}
