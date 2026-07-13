import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { ReservationsService } from "./reservations.service";

@Controller("reservations")
export class ReservationsController {
  constructor(private readonly service: ReservationsService) {}

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

  @Patch(":id/confirm")
  confirm(@Param("id") id: string) {
    return this.service.confirm(id);
  }

  @Patch(":id/cancel")
  cancel(@Param("id") id: string, @Body() dto: any) {
    return this.service.cancel(id, dto);
  }

  @Patch(":id/release")
  release(@Param("id") id: string, @Body() dto: any) {
    return this.service.release(id, dto);
  }

  @Post("expire-due")
  expireDue() {
    return this.service.expireDue();
  }
}
