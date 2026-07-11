import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { InventoryTransactionsService } from "./inventory-transactions.service";

@Controller("inventory-transactions")
export class InventoryTransactionsController {

  constructor(
    private readonly service: InventoryTransactionsService
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
