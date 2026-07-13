import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { InventoryService } from "./inventory.service";

@Controller("inventory")
export class InventoryController {
  constructor(private readonly service: InventoryService) {}

  @Get()
  findAll(@Query() query: any) {
    return this.service.findAll(query);
  }

  @Get("dashboard")
  dashboard() {
    return this.service.dashboard();
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

  @Post(":id/reserve")
  reserve(@Param("id") id: string, @Body() dto: any) {
    return this.service.reserve(id, dto);
  }

  @Post(":id/release")
  release(@Param("id") id: string, @Body() dto: any) {
    return this.service.release(id, dto);
  }

  @Post(":id/mark-sold")
  markSold(@Param("id") id: string, @Body() dto: any) {
    return this.service.markSold(id, dto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.service.remove(id);
  }
}
