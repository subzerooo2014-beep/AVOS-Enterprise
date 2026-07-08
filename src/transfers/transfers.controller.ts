import { Body, Controller, Get, Post } from "@nestjs/common";
import { TransfersService } from "./transfers.service";

@Controller("transfers")
export class TransfersController {
  constructor(private service:TransfersService){}
  @Get() findAll(){ return this.service.findAll(); }
  @Post() create(@Body() dto:any){ return this.service.create(dto); }
}
