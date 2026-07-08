import { Body, Controller, Get, Post } from "@nestjs/common";
import { ToolsService } from "./tools.service";

@Controller("tools")
export class ToolsController {
  constructor(private service:ToolsService){}
  @Get() findAll(){ return this.service.findAll(); }
  @Post() create(@Body() dto:any){ return this.service.create(dto); }
}
