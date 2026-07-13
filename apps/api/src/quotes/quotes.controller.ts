import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { QuotesService } from "./quotes.service";

@Controller("quotes")
export class QuotesController {
  constructor(private readonly service: QuotesService) {}

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

  @Post(":id/submit")
  submit(@Param("id") id: string) {
    return this.service.submit(id);
  }

  @Post(":id/approve")
  approve(@Param("id") id: string) {
    return this.service.approve(id);
  }

  @Post(":id/reject")
  reject(@Param("id") id: string) {
    return this.service.reject(id);
  }

  @Post(":id/convert-to-order")
  convertToOrder(@Param("id") id: string, @Body() dto: any) {
    return this.service.convertToOrder(id, dto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.service.remove(id);
  }
}
