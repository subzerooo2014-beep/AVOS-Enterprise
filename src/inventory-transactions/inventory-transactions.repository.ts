import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class InventoryTransactionsRepository {

  constructor(
    private readonly prisma: PrismaService
  ) {}

  private get model() {
    return (this.prisma as any)["inventoryTransaction"];
  }

  findAll() {
    return this.model.findMany({
      orderBy:{
        createdAt:"desc"
      }
    });
  }

  findOne(id:string) {
    return this.model.findUnique({
      where:{
        id
      }
    });
  }

  create(data:any) {
    return this.model.create({
      data
    });
  }

}
