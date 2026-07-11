import { Body, Controller, Get, Post } from "@nestjs/common";
import { CommissionEngineService } from "./commission-engine.service";

@Controller("commission-engine")
export class CommissionEngineController {
  constructor(private service: CommissionEngineService) {}

  @Post("policies")
  createPolicy(@Body() body: any) {
    return this.service.createPolicy(body);
  }

  @Get("policies")
  listPolicies() {
    return this.service.listPolicies();
  }

  @Post("calculate")
  calculate(@Body() body: any) {
    return this.service.calculate(body);
  }

  @Get("records")
  records() {
    return this.service.listRecords();
  }
}
