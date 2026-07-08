import { Body, Controller, Get, Post } from "@nestjs/common";
import { AgentsService } from "./agents.service";

@Controller("agents")
export class AgentsController {
  constructor(private service:AgentsService){}
  @Get() findAll(){ return this.service.findAll(); }
  @Post() create(@Body() dto:any){ return this.service.create(dto); }
}
