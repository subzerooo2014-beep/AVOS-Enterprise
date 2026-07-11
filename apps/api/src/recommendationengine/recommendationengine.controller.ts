import { Body, Controller, Get, Post } from "@nestjs/common";
import { RecommendationengineService } from "./recommendationengine.service";

@Controller("recommendationengine")
export class RecommendationengineController {
  constructor(private service:RecommendationengineService){}
  @Get() findAll(){ return this.service.findAll(); }
  @Post() create(@Body() dto:any){ return this.service.create(dto); }
}
