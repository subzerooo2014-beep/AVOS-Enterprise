import { Body, Controller, Get, Post } from "@nestjs/common";
import { PurchasesService } from "./purchases.service";

@Controller("purchases")
export class PurchasesController {
  constructor(private service: PurchasesService) {}
  @Get() findAll() { return this.service.findAll(); }
  @Post() create(@Body() dto: any) { return this.service.create(dto); }
}
