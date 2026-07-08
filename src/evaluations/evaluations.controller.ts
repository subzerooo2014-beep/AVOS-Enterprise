import { Body, Controller, Get, Post } from "@nestjs/common";
import { EvaluationsService } from "./evaluations.service";

@Controller("evaluations")
export class EvaluationsController {
  constructor(private service:EvaluationsService){}
  @Get() findAll(){ return this.service.findAll(); }
  @Post() create(@Body() dto:any){ return this.service.create(dto); }
}
