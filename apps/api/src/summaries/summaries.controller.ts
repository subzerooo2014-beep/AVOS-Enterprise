import { Body, Controller, Get, Post } from "@nestjs/common";
import { SummariesService } from "./summaries.service";

@Controller("summaries")
export class SummariesController {
  constructor(private service:SummariesService){}
  @Get() findAll(){ return this.service.findAll(); }
  @Post() create(@Body() dto:any){ return this.service.create(dto); }
}
