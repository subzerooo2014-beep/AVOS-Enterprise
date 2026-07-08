import { Body, Controller, Get, Post } from "@nestjs/common";
import { ExpensesService } from "./expenses.service";

@Controller("expenses")
export class ExpensesController {
  constructor(private service: ExpensesService) {}
  @Get() findAll() { return this.service.findAll(); }
  @Post() create(@Body() dto: any) { return this.service.create(dto); }
}
