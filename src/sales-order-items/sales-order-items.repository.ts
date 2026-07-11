import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class SalesOrderItemsRepository {

 constructor(
  private readonly prisma:PrismaService
 ){}

 private get model(){
  return (this.prisma as any)["salesOrderItem"];
 }

 findAll(orderId:string){

  return this.model.findMany({
   where:{
    salesOrderId:orderId
   }
  });

 }

 create(data:any){

  return this.model.create({
   data
  });

 }

}
