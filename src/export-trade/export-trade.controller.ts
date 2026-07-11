import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ExportTradeService } from "./export-trade.service";

@Controller("export-trade")
export class ExportTradeController {
  constructor(private service: ExportTradeService) {}

  @Post("vehicles")
  create(@Body() body: any) {
    return this.service.create(body);
  }

  @Get("vehicles")
  findAll() {
    return this.service.findAll();
  }

  @Get("vehicles/:id")
  findOne(@Param("id") id: string) {
    return this.service.findOne(id);
  }

  @Post("vehicles/:id/score")
  score(@Param("id") id: string) {
    return this.service.scoreExportReadiness(id);
  }
}
