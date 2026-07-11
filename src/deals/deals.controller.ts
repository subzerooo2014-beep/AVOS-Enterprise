import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { DealsService } from "./deals.service";

@Controller("deals")
export class DealsController {
  constructor(private service: DealsService) {}

  @Post()
  create(@Body() body: any) {
    return this.service.create(body);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.service.findOne(id);
  }

  @Post(":id/score")
  score(@Param("id") id: string) {
    return this.service.calculateDealScore(id);
  }

  @Post(":id/commission")
  commission(@Param("id") id: string, @Body() body: any) {
    return this.service.calculateCommission(id, Number(body.amount || 0), Number(body.percent || 1.5));
  }
}
