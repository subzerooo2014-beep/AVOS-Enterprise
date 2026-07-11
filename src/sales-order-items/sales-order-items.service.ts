import { Injectable } from "@nestjs/common";
import { SalesOrderItemsRepository } from "./sales-order-items.repository";
import { SalesOrderItemsMapper } from "./sales-order-items.mapper";

@Injectable()
export class SalesOrderItemsService {

 constructor(
  private readonly repo:SalesOrderItemsRepository,
  private readonly mapper:SalesOrderItemsMapper
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
