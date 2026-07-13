import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { OrdersService } from "./orders.service";

@Controller("orders")
export class OrdersController {
  constructor(private readonly service: OrdersService) {}

  @Get()
  findAll(@Query() query: any) {
    return this.service.findAll(query);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: any) {
    return this.service.create(dto);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: any) {
    return this.service.update(id, dto);
  }

  @Post(":id/confirm")
  confirm(@Param("id") id: string) {
    return this.service.confirm(id);
  }

  @Post(":id/cancel")
  cancel(@Param("id") id: string) {
    return this.service.cancel(id);
  }

  @Post(":id/create-invoice")
  createInvoice(@Param("id") id: string, @Body() dto: any) {
    return this.service.createInvoice(id, dto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.service.remove(id);
  }
}
