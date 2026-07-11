import { Body, Controller, Get, Post } from "@nestjs/common";
import { ContractsService } from "./contracts.service";

@Controller("contracts")
export class ContractsController {
  constructor(private service:ContractsService){}
  @Get() findAll(){ return this.service.findAll(); }
  @Post() create(@Body() dto:any){ return this.service.create(dto); }
}
