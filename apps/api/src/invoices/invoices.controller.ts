import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { InvoicesService } from "./invoices.service";

@Controller("invoices")
export class InvoicesController {
  constructor(private readonly service: InvoicesService) {}

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

  @Post(":id/issue")
  issue(@Param("id") id: string) {
    return this.service.issue(id);
  }

  @Post(":id/cancel")
  cancel(@Param("id") id: string) {
    return this.service.cancel(id);
  }

  @Post(":id/register-payment")
  registerPayment(@Param("id") id: string, @Body() dto: any) {
    return this.service.registerPayment(id, dto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.service.remove(id);
  }
}
