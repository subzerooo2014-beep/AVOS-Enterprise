import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { SalesOrdersService } from "./sales-orders.service";

@Controller("sales-orders")
export class SalesOrdersController {

 constructor(
  private readonly service:SalesOrdersService
 ) {}

 @Get()
 findAll(){
  return this.service.findAll();
 }

 @Get(":id")
 findOne(
  @Param("id") id:string
 ){
  return this.service.findOne(id);
 }

 @Post()
 create(
  @Body() dto:any
 ){
  return this.service.create(dto);
 }

}
