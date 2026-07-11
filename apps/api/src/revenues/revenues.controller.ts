import { Body, Controller, Get, Post } from "@nestjs/common";
import { RevenuesService } from "./revenues.service";

@Controller("revenues")
export class RevenuesController {
  constructor(private service: RevenuesService) {}
  @Get() findAll() { return this.service.findAll(); }
  @Post() create(@Body() dto: any) { return this.service.create(dto); }
}
