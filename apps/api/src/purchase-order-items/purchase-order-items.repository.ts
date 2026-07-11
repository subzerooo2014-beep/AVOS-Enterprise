import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class PurchaseOrderItemsRepository {

 constructor(
  private readonly prisma:PrismaService
 ){}

 private get model(){
  return (this.prisma as any)["purchaseOrderItem"];
 }

 findAll(orderId:string){

  return this.model.findMany({
   where:{
    purchaseOrderId:orderId
   }
  });

 }

 create(data:any){

  return this.model.create({
   data
  });

 }

}
