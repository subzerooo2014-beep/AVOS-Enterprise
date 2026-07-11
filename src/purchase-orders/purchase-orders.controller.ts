import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { PurchaseOrdersService } from "./purchase-orders.service";

@Controller("purchase-orders")
export class PurchaseOrdersController {

  constructor(
    private readonly service: PurchaseOrdersService
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

  @Patch(":id")
  update(
    @Param("id") id:string,
    @Body() dto:any
  ){
    return this.service.update(id,dto);
  }

}
