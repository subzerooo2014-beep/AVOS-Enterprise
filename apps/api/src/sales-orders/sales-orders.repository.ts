import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class SalesOrdersRepository {

  constructor(
    private readonly prisma: PrismaService
  ) {}

  private get model() {
    return (this.prisma as any)["salesOrder"];
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
      where:{id}
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
