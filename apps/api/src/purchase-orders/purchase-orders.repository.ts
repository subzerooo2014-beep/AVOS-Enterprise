import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class PurchaseOrdersRepository {

  constructor(
    private readonly prisma: PrismaService
  ) {}

  private get model() {
    return (this.prisma as any)["purchaseOrder"];
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
      where:{id},
      include:{
        items:true
      }
    });
  }

  create(data:any) {
    return this.model.create({
      data
    });
  }

  update(id:string,data:any) {
    return this.model.update({
      where:{id},
      data
    });
  }

}
