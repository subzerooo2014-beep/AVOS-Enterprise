import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { SalesService } from "./sales.service";

@Controller("sales")
export class SalesController {
  constructor(private readonly service: SalesService) {}

  @Get()
  findAll(@Query() query: any) { return this.service.findAll(query); }

  @Get("dashboard")
  dashboard() { return this.service.dashboard(); }

  @Get(":id")
  findOne(@Param("id") id: string) { return this.service.findOne(id); }

  @Post()
  create(@Body() dto: any) { return this.service.create(dto); }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: any) { return this.service.update(id, dto); }

  @Post(":id/submit")
  submit(@Param("id") id: string) { return this.service.submit(id); }

  @Post(":id/approve")
  approve(@Param("id") id: string) { return this.service.approve(id); }

  @Post(":id/won")
  won(@Param("id") id: string) { return this.service.closeWon(id); }

  @Post(":id/lost")
  lost(@Param("id") id: string) { return this.service.closeLost(id); }

  @Post(":id/cancel")
  cancel(@Param("id") id: string) { return this.service.cancel(id); }

  @Post(":id/close")
  close(@Param("id") id: string) { return this.service.close(id); }

  @Post(":id/finalize-deal")
  finalizeDeal(@Param("id") id: string, @Body() dto: any) {
    return this.service.finalizeDeal(id, dto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) { return this.service.remove(id); }
}
