import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { PurchaseOrderItemsService } from "./purchase-order-items.service";

@Controller("purchase-order-items")
export class PurchaseOrderItemsController {

 constructor(
  private readonly service:PurchaseOrderItemsService
 ){}

 @Get(":orderId")
 findAll(
  @Param("orderId") orderId:string
 ){
  return this.service.findAll(orderId);
 }


 @Post()
 create(
  @Body() dto:any
 ){
  return this.service.create(dto);
 }

}
