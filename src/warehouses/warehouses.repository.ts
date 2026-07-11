import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { WAREHOUSES_MODEL } from "./constants/warehouses.constants";

@Injectable()
export class WarehousesRepository {
  constructor(private readonly prisma: PrismaService) {}

  private get model() {
    return (this.prisma as any)[WAREHOUSES_MODEL];
  }

  findAll() {
    return this.model.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  findById(id: string) {
    return this.model.findUnique({
      where: { id },
    });
  }

  create(data: any) {
    return this.model.create({
      data,
    });
  }

  update(id: string, data: any) {
    return this.model.update({
      where: { id },
      data,
    });
  }
}
