import { Body, Controller, Get, Post } from "@nestjs/common";
import { AccountingService } from "./accounting.service";

@Controller("accounting")
export class AccountingController {
  constructor(private service: AccountingService) {}
  @Get() findAll() { return this.service.findAll(); }
  @Post() create(@Body() dto: any) { return this.service.create(dto); }
}
