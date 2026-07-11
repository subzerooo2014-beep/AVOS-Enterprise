import { Body, Controller, Get, Post } from "@nestjs/common";
import { TaxesService } from "./taxes.service";

@Controller("taxes")
export class TaxesController {
  constructor(private service: TaxesService) {}
  @Get() findAll() { return this.service.findAll(); }
  @Post() create(@Body() dto: any) { return this.service.create(dto); }
}
