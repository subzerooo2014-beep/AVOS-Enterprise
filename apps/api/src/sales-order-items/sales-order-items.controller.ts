import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { SalesOrderItemsService } from "./sales-order-items.service";

@Controller("sales-order-items")
export class SalesOrderItemsController {

 constructor(
  private readonly service:SalesOrderItemsService
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
