import { Injectable } from "@nestjs/common";
import { PurchaseOrderItemsRepository } from "./purchase-order-items.repository";
import { PurchaseOrderItemsMapper } from "./purchase-order-items.mapper";

@Injectable()
export class PurchaseOrderItemsService {

 constructor(
  private readonly repo:PurchaseOrderItemsRepository,
  private readonly mapper:PurchaseOrderItemsMapper
 ){}

 findAll(orderId:string){

  return this.repo.findAll(orderId);

 }


 create(dto:any){

  return this.repo.create(
   this.mapper.toCreateData(dto)
  );

 }

}
