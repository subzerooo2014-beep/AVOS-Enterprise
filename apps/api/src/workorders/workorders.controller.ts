import { Body, Controller, Get, Post } from "@nestjs/common";
import { WorkordersService } from "./workorders.service";

@Controller("workorders")
export class WorkordersController {
  constructor(private service:WorkordersService){}
  @Get() findAll(){ return this.service.findAll(); }
  @Post() create(@Body() dto:any){ return this.service.create(dto); }
}
